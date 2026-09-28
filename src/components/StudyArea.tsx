import { CalendarClock, ClipboardList, FileDown, Lock, LogOut, Stethoscope } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage'
import { Section } from './Section'

// One icon per feature card, in the order the features appear in every language file.
const FEATURE_ICONS = [CalendarClock, ClipboardList, FileDown, Stethoscope, LogOut]

// Placeholder for the participant portal: it needs authentication and a backend,
// so for now this section only describes what enrolled participants will get.
export function StudyArea() {
  const { studyArea } = useLanguage().t
  return (
    <Section id="study-area" title={studyArea.title} subtitle={studyArea.subtitle}>
      <p>{studyArea.intro}</p>
      <ul className="feature-grid">
        {studyArea.features.map((f, i) => {
          const Icon = FEATURE_ICONS[i]
          return (
            <li key={f.title} className="card">
              {Icon && <Icon className="card__icon" aria-hidden="true" />}
              <h3>{f.title}</h3>
              <p>
                {f.text}
                {f.href && <> <a href={f.href} target="_blank" rel="noreferrer">{f.linkLabel}</a></>}
              </p>
              {f.list && <ul>{f.list.map((d) => <li key={d}>{d}</li>)}</ul>}
            </li>
          )
        })}
      </ul>
      <div className="login-box">
        <button className="button button--secondary" disabled>
          <Lock className="button__icon" aria-hidden="true" />
          {studyArea.login}
        </button>
        <p className="muted">{studyArea.loginSoon}</p>
      </div>
    </Section>
  )
}
