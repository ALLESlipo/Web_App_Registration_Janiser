import { DoorOpen, FileSearch, IdCard, KeyRound, ShieldCheck, TestTube } from 'lucide-react'
import shield from '../assets/illustrations/privacy-shield.svg'
import { useLanguage } from '../i18n/useLanguage'
import { Section } from './Section'
import { Text } from './Text'

// One icon per privacy point, in the order the points appear in every language file.
const POINT_ICONS = [IdCard, KeyRound, TestTube, ShieldCheck, FileSearch, DoorOpen]

export function Privacy() {
  const { privacy } = useLanguage().t
  return (
    <Section id="privacy" title={privacy.title} tone="tinted">
      <div className="split split--compact">
        <p className="prose">{privacy.intro}</p>
        <img className="split__art" src={shield} alt="" width="360" height="360" loading="lazy" />
      </div>
      <ul className="card-list">
        {privacy.points.map((p, i) => {
          const Icon = POINT_ICONS[i]
          return (
            <li key={p} className="card card--icon">
              {Icon && <Icon className="card__icon" aria-hidden="true" />}
              <p><Text>{p}</Text></p>
            </li>
          )
        })}
      </ul>
      <p>{privacy.more}</p>
    </Section>
  )
}
