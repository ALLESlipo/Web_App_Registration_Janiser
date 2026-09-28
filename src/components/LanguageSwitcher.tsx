import { useLanguage } from '../i18n/useLanguage'
import { LANGUAGES } from '../i18n/languages'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className={`lang-switcher ${className}`} role="group" aria-label={t.meta.language}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          className="lang-switcher__button"
          lang={l.code}
          title={l.name}
          aria-pressed={lang === l.code}
          onClick={() => setLang(l.code)}
        >
          <img src={l.flag} alt="" width="24" height="18" />
          <span className="visually-hidden">{l.name}</span>
        </button>
      ))}
    </div>
  )
}
