import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage'
import { Section } from './Section'
import { Text } from './Text'

export function Eligibility() {
  const { eligibility } = useLanguage().t
  // The arrow is drawn as an icon, so drop the text arrow from the copy.
  const cta = eligibility.cta.replace(/\s*→\s*$/, '')
  return (
    <Section id="eligibility" title={eligibility.title} subtitle={eligibility.subtitle} tone="tinted">
      <p>{eligibility.intro}</p>
      <ul className="checklist">
        {eligibility.criteria.map((c) => <li key={c}><Text>{c}</Text></li>)}
      </ul>
      <p>{eligibility.note}</p>
      <p className="callout callout--warning"><strong>{eligibility.warningLabel}</strong> {eligibility.warning}</p>
      <a className="button button--primary" href="#register">
        {cta}
        <ArrowRight className="button__icon" aria-hidden="true" />
      </a>
    </Section>
  )
}
