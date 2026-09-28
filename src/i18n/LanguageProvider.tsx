import { useEffect, useState, type ReactNode } from 'react'
import { LanguageContext } from './context'
import { detectLanguage, LANGUAGES, rememberLanguage, type LanguageCode } from './languages'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(detectLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (code: LanguageCode) => {
    setLangState(code)
    rememberLanguage(code)
  }

  const t = LANGUAGES.find((l) => l.code === lang)!.content
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}
