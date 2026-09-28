import { useLanguage } from '../i18n/useLanguage'
import { Section } from './Section'
import { Text } from './Text'

export function Faq() {
  const { faq } = useLanguage().t
  return (
    <Section id="faq" title={faq.title} tone="tinted">
      <div className="faq">
        {faq.items.map((item) => (
          <details key={item.q} className="faq__item">
            <summary>{item.q}</summary>
            <p><Text>{item.a}</Text></p>
          </details>
        ))}
      </div>
    </Section>
  )
}
