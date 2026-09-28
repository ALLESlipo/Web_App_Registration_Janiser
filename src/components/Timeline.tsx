import { useLanguage } from '../i18n/useLanguage'
import { Section } from './Section'

export function Timeline() {
  const { expect } = useLanguage().t
  return (
    <Section id="expect" title={expect.title} subtitle={expect.subtitle}>
      <ol className="timeline">
        {expect.steps.map((s) => (
          <li key={s.when} className="timeline__item">
            <span className="timeline__when">{s.when}</span>
            <p className="timeline__what">{s.what}</p>
          </li>
        ))}
      </ol>
      <p className="callout">{expect.reminders}</p>
    </Section>
  )
}
