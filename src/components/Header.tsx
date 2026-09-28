import { useEffect, useRef, useState } from 'react'
import { SECTION_IDS, STUDY_NAME } from '../content/types'
import { useLanguage } from '../i18n/useLanguage'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('home')
  const headerRef = useRef<HTMLElement>(null)

  // Highlight the menu item for the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Longer menu labels in some languages wrap onto more lines; keep anchor jumps
  // clear of the sticky header whatever its height.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight}px`)
    })
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container site-header__bar">
        <a href="#home" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark" aria-hidden="true" />
          {STUDY_NAME}
        </a>
        <LanguageSwitcher className="lang-switcher--header" />
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">{t.meta.menu}</span>
          <span className="menu-toggle__bar" aria-hidden="true" />
        </button>
      </div>
      <nav id="site-nav" className={`site-nav${open ? ' is-open' : ''}`} aria-label={t.meta.mainNav}>
        <div className="container">
          <LanguageSwitcher className="lang-switcher--menu" />
          <ul>
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={id === 'register' ? 'site-nav__cta' : undefined}
                  aria-current={active === id ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
