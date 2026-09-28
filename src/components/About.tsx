import { CalendarDays, Droplet, HeartHandshake, MessagesSquare, Pipette, Users } from 'lucide-react'
import probiotic from '../assets/illustrations/probiotic.svg'
import { useLanguage } from '../i18n/useLanguage'
import { Section } from './Section'

// One icon per fact card, in the order the facts appear in every language file.
const FACT_ICONS = [Users, CalendarDays, Pipette, MessagesSquare, Droplet, HeartHandshake]

export function About() {
  const { about } = useLanguage().t
  return (
    <Section id="about" title={about.title}>
      <div className="split">
        <div className="prose">
          {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
        <img className="split__art" src={probiotic} alt="" width="360" height="360" loading="lazy" />
      </div>
      <ul className="fact-grid">
        {about.facts.map((f, i) => {
          const Icon = FACT_ICONS[i]
          return (
            <li key={f.label} className="fact">
              {Icon && <Icon className="fact__icon" aria-hidden="true" />}
              <span className="fact__value">{f.value}</span>
              <span className="fact__label">{f.label}</span>
            </li>
          )
        })}
      </ul>
      <p className="callout">{about.note}</p>
    </Section>
  )
}
