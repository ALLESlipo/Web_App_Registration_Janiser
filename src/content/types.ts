// Shape of the site copy. Every language file (en, de, es, el, sq) provides one of these.
// In strings, *text* is shown in bold and [ text ] is shown as a highlighted placeholder.

export const SECTION_IDS = ['home', 'about', 'eligibility', 'expect', 'privacy', 'register', 'study-area', 'faq', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

export const STUDY_NAME = 'PB-TRD-2-Study 26/27'

type Consent = { id: string; text: string } | { id: string; before: string; link: string; after: string }

type Feature = {
  title: string
  text: string
  href?: string
  linkLabel?: string
  list?: string[]
}

export type Content = {
  meta: {
    skipLink: string
    menu: string
    mainNav: string
    language: string
  }
  nav: Record<SectionId, string>
  safety: { title: string; text: string; call: string }
  hero: { headline: string; subheadline: string; primaryCta: string; secondaryCta: string }
  about: {
    title: string
    paragraphs: string[]
    facts: { value: string; label: string }[]
    note: string
  }
  eligibility: {
    title: string
    subtitle: string
    intro: string
    criteria: string[]
    note: string
    warningLabel: string
    warning: string
    cta: string
  }
  expect: { title: string; subtitle: string; steps: { when: string; what: string }[]; reminders: string }
  privacy: { title: string; intro: string; points: string[]; more: string }
  register: {
    title: string
    intro: string
    fields: {
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
    optional: string
    // `value`s are what gets stored; they must stay the same in every language.
    genders: { value: 'female' | 'male'; label: string }[]
    contactTimes: { value: string; label: string }[]
    consentTitle: string
    consents: Consent[]
    submit: string
    submitting: string
    errors: {
      required: string
      email: string
      phone: string
      dateOfBirth: string
      consent: string
      invalid: string
      duplicate: string
      rateLimited: string
      network: string
    }
    confirmationTitle: string
    confirmation: string
  }
  studyArea: {
    title: string
    subtitle: string
    intro: string
    login: string
    loginSoon: string
    features: Feature[]
  }
  faq: { title: string; items: { q: string; a: string }[] }
  contact: {
    title: string
    general: { label: string; email: string; phone: string }
    nurse: { label: string; text: string }
    emergency: { label: string; text: string }
  }
  footer: { org: string[]; links: string[]; compliance: string; crisis: string }
}
