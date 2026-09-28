import { LifeBuoy } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage'

export function SafetyStrip() {
  const { t } = useLanguage()
  return (
    <aside className="safety-strip" role="note" aria-label={t.safety.title}>
      <div className="container safety-strip__inner">
        <LifeBuoy className="safety-strip__icon" aria-hidden="true" />
        <p>
          <strong>{t.safety.title}</strong> {t.safety.text}{' '}
          <a href="tel:112">{t.safety.call}</a>
        </p>
      </div>
    </aside>
  )
}
