import { useState, type FormEvent } from 'react'
import type { Content } from '../content/types'
import { LANGUAGES } from '../i18n/languages'
import { useLanguage } from '../i18n/useLanguage'
import { Section } from './Section'
import { Text } from './Text'

// Registrations are POSTed as JSON to the nutriminds-survey plugin's REST endpoint
// on nutriminds.net and stored under the study's project there (see .env.example).
// Without an endpoint the form runs in demo mode and sends nothing.
const PROJECT_ID = Number(import.meta.env.VITE_NMS_PROJECT_ID)
const ENDPOINT = PROJECT_ID > 0 ? (import.meta.env.VITE_REGISTRATION_ENDPOINT as string | undefined) : undefined

// Languages the plugin can write its confirmation email in; others get English.
const PLUGIN_LANGUAGES = ['en', 'de']

type Fields = {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  phone: string
  country: string
  city: string
  language: string
  contactTime: string
}

// Errors hold message keys, not text, so they follow a language switch.
type ErrorKey = keyof Content['register']['errors']
type Errors = Partial<Record<keyof Fields | 'consent' | 'form', ErrorKey>>

const required: (keyof Fields)[] = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'email', 'phone', 'country', 'city', 'language']

// Same rule the plugin applies server-side, so people see the problem before submitting.
function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return /^\+?[\d\s().-]{7,24}$/.test(phone) && digits.length >= 7 && digits.length <= 20
}

// The date of birth is typed as DD/MM/YYYY (European order) in a text field: a native date
// input would show the browser's own format, e.g. MM/DD/YYYY in US-English browsers.

// Keeps the digits and adds the slashes, so "15051990" reads "15/05/1990". A slash is only
// added once the next digit is typed, so Backspace is never stuck behind it.
function formatDateOfBirth(raw: string) {
  // Browser autofill may supply an ISO date; turn it round instead of mangling it.
  const iso = raw.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/')
}

// "15/05/1990" → "1990-05-15" (the format the plugin stores), or null if it is not a real date.
function parseDateOfBirth(value: string): string | null {
  const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const [day, month, year] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(Date.UTC(year, month - 1, day))
  // Rejects dates like 31/02 that JavaScript would silently roll over into March.
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  if (year < 1900 || date.getTime() > Date.now()) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

function validate(fields: Fields, consents: Record<string, boolean>, consentIds: string[]): Errors {
  const errors: Errors = {}
  for (const key of required) {
    if (!fields[key].trim()) errors[key] = 'required'
  }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'email'
  }
  if (fields.phone && !isValidPhone(fields.phone.trim())) {
    errors.phone = 'phone'
  }
  if (fields.dateOfBirth && !parseDateOfBirth(fields.dateOfBirth)) {
    errors.dateOfBirth = 'dateOfBirth'
  }
  if (!consentIds.every((id) => consents[id])) {
    errors.consent = 'consent'
  }
  return errors
}

function errorForStatus(status: number): ErrorKey {
  if (status === 409) return 'duplicate'
  if (status === 429) return 'rateLimited'
  if (status === 400) return 'invalid'
  return 'network'
}

export function RegisterForm() {
  const { lang, t } = useLanguage()
  const register = t.register
  const [fields, setFields] = useState<Fields>(() => ({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    language: LANGUAGES.find((l) => l.code === lang)!.name,
    contactTime: '',
  }))
  const [consents, setConsents] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [honeypot, setHoneypot] = useState('')

  const message = (key: keyof Errors) => {
    const errorKey = errors[key]
    return errorKey ? register.errors[errorKey] : undefined
  }

  // Editing a field clears its error message; the full check runs again on submit.
  const setField = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors(({ [key]: _cleared, ...rest }) => rest)
  }

  const update = (key: keyof Fields) => (e: { target: { value: string } }) => setField(key, e.target.value)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validate(fields, consents, register.consents.map((c) => c.id))
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      document.getElementById(first === 'consent' ? 'consent-group' : `reg-${first}`)?.focus()
      return
    }

    setStatus('submitting')
    try {
      if (ENDPOINT) {
        // Sent form-encoded rather than as JSON: a form POST is a "simple" cross-origin
        // request, so the browser skips the CORS preflight. The production server answers
        // preflights without Access-Control-Allow-Origin, which would block a JSON request.
        const body = new URLSearchParams({
          first_name: fields.firstName.trim(),
          last_name: fields.lastName.trim(),
          birthday: parseDateOfBirth(fields.dateOfBirth) ?? '',
          gender: fields.gender,
          phone: fields.phone.trim(),
          email: fields.email.trim(),
          country: fields.country.trim(),
          city: fields.city.trim(),
          preferred_language: fields.language,
          contact_time: fields.contactTime,
          project_id: String(PROJECT_ID),
          consent: '1',
          language: PLUGIN_LANGUAGES.includes(lang) ? lang : 'en',
          website: honeypot,
        })
        // PHP reads consents[age]=1 etc. as an array, like the JSON object before.
        for (const [id, agreed] of Object.entries(consents)) {
          if (agreed) body.append(`consents[${id}]`, '1')
        }
        const res = await fetch(ENDPOINT, { method: 'POST', body })
        const data = await res.json().catch(() => null)
        if (!res.ok || !data?.success) {
          setErrors({ form: errorForStatus(res.status) })
          setStatus('idle')
          return
        }
      }
      setStatus('done')
    } catch {
      setErrors({ form: 'network' })
      setStatus('idle')
    }
  }

  const field = (key: keyof Fields, type = 'text', autoComplete?: string) => {
    const isRequired = required.includes(key)
    const error = message(key)
    return (
      <div className="field">
        <label htmlFor={`reg-${key}`}>
          {register.fields[key]}
          {!isRequired && <span className="field__optional"> ({register.optional})</span>}
        </label>
        <input
          id={`reg-${key}`}
          type={type}
          value={fields[key]}
          onChange={update(key)}
          autoComplete={autoComplete}
          aria-required={isRequired}
          aria-invalid={!!error}
          aria-describedby={error ? `reg-${key}-error` : undefined}
        />
        {error && <p id={`reg-${key}-error`} className="field__error">{error}</p>}
      </div>
    )
  }

  const select = (key: keyof Fields, options: { value: string; label: string }[]) => {
    const isRequired = required.includes(key)
    const error = message(key)
    return (
      <div className="field">
        <label htmlFor={`reg-${key}`}>
          {register.fields[key]}
          {!isRequired && <span className="field__optional"> ({register.optional})</span>}
        </label>
        <select
          id={`reg-${key}`}
          value={fields[key]}
          onChange={update(key)}
          aria-required={isRequired}
          aria-invalid={!!error}
          aria-describedby={error ? `reg-${key}-error` : undefined}
        >
          <option value="">—</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p id={`reg-${key}-error`} className="field__error">{error}</p>}
      </div>
    )
  }

  if (status === 'done') {
    return (
      <Section id="register" title={register.title}>
        <div className="confirmation" role="status" tabIndex={-1}>
          <h3>{register.confirmationTitle}</h3>
          <p><Text>{register.confirmation}</Text></p>
          {!ENDPOINT && <DemoNotice />}
        </div>
      </Section>
    )
  }

  return (
    <Section id="register" title={register.title}>
      <p className="prose">{register.intro}</p>
      {!ENDPOINT && <DemoNotice />}

      <form className="form" onSubmit={handleSubmit} noValidate>
        {/* Spam trap: hidden from people, filled in by bots; the plugin silently discards those. */}
        <label className="honeypot" aria-hidden="true">
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
        <div className="form__grid">
          {field('firstName', 'text', 'given-name')}
          {field('lastName', 'text', 'family-name')}
          <div className="field">
            <label htmlFor="reg-dateOfBirth">
              {register.fields.dateOfBirth}
              <span className="field__optional"> ({register.dateFormat})</span>
            </label>
            <input
              id="reg-dateOfBirth"
              type="text"
              inputMode="numeric"
              autoComplete="bday"
              placeholder={register.dateFormat}
              maxLength={10}
              value={fields.dateOfBirth}
              onChange={(e) => setField('dateOfBirth', formatDateOfBirth(e.target.value))}
              aria-required
              aria-invalid={!!errors.dateOfBirth}
              aria-describedby={errors.dateOfBirth ? 'reg-dateOfBirth-error' : undefined}
            />
            {errors.dateOfBirth && <p id="reg-dateOfBirth-error" className="field__error">{message('dateOfBirth')}</p>}
          </div>
          {select('gender', register.genders)}
          {field('email', 'email', 'email')}
          {field('phone', 'tel', 'tel')}
          {field('country', 'text', 'country-name')}
          {field('city', 'text', 'address-level2')}
          {/* Language names are shown in their own language, so they read the same everywhere. */}
          {select('language', LANGUAGES.map((l) => ({ value: l.name, label: l.name })))}
          {select('contactTime', register.contactTimes)}
        </div>

        <fieldset
          id="consent-group"
          className="consents"
          tabIndex={-1}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
        >
          <legend>{register.consentTitle}</legend>
          {register.consents.map((c) => (
            <label key={c.id} className="consent">
              <input
                type="checkbox"
                checked={!!consents[c.id]}
                onChange={(e) => setConsents((s) => ({ ...s, [c.id]: e.target.checked }))}
              />
              <span>
                {'text' in c ? c.text : (
                  // TODO: link to the real documents once they are available.
                  <>{c.before}<a href="#privacy">{c.link}</a>{c.after}</>
                )}
              </span>
            </label>
          ))}
          {errors.consent && <p id="consent-error" className="field__error">{message('consent')}</p>}
        </fieldset>

        {errors.form && <p className="field__error" role="alert">{message('form')}</p>}

        <button className="button button--primary" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? register.submitting : register.submit}
        </button>
      </form>
    </Section>
  )
}

// Developer-facing only (shown when no endpoint is configured), so not translated.
function DemoNotice() {
  return (
    <p className="demo-notice" lang="en">
      <strong>Demo mode:</strong> no registration endpoint is configured, so submitted data is not sent or
      stored anywhere.
    </p>
  )
}
