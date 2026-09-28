import { createContext } from 'react'
import type { Content } from '../content/types'
import type { LanguageCode } from './languages'

export type LanguageState = {
  lang: LanguageCode
  setLang: (code: LanguageCode) => void
  t: Content
}

export const LanguageContext = createContext<LanguageState | null>(null)
