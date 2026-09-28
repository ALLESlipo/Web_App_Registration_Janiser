import { useLanguage } from '../i18n/useLanguage'
import { Text } from './Text'

export function Footer() {
  const { footer } = useLanguage().t
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="site-footer__org">
          {footer.org.map((o, i) => (
            <span key={o}>{i > 0 && ' · '}<Text>{o}</Text></span>
          ))}
        </p>
        <ul className="site-footer__links">
          {/* TODO: link to the real documents once they are available. */}
          {footer.links.map((l) => <li key={l}><a href="#privacy">{l}</a></li>)}
        </ul>
        <p><Text>{footer.compliance}</Text></p>
        <p className="site-footer__crisis">{footer.crisis}</p>
      </div>
    </footer>
  )
}
