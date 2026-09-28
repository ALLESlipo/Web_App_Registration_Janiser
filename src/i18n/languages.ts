import al from 'flag-icons/flags/4x3/al.svg'
import de_flag from 'flag-icons/flags/4x3/de.svg'
import es_flag from 'flag-icons/flags/4x3/es.svg'
import gb from 'flag-icons/flags/4x3/gb.svg'
import gr from 'flag-icons/flags/4x3/gr.svg'
import { de } from '../content/de'
import { el } from '../content/el'
import { en } from '../content/en'
import { es } from '../content/es'
import { sq } from '../content/sq'
import type { Content } from '../content/types'

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: gb, content: en },
  { code: 'de', name: 'Deutsch', flag: de_flag, content: de },
  { code: 'es', name: 'Español', flag: es_flag, content: es },
  { code: 'el', name: 'Ελληνικά', flag: gr, content: el },
  { code: 'sq', name: 'Shqip', flag: al, content: sq },
] as const satisfies readonly { code: string; name: string; flag: string; content: Content }[]

export type LanguageCode = (typeof LANGUAGES)[number]['code']

const STORAGE_KEY = 'lang'

export function isLanguageCode(value: unknown): value is LanguageCode {
  return LANGUAGES.some((l) => l.code === value)
}

// Order: ?lang= in the URL, the visitor's earlier choice, the browser's languages, English.
export function detectLanguage(): LanguageCode {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isLanguageCode(fromUrl)) return fromUrl

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLanguageCode(saved)) return saved
  } catch {
    // Storage can be unavailable (private mode, blocked site data).
  }

  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLanguageCode(base)) return base
  }
  return 'en'
}

export function rememberLanguage(code: LanguageCode) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // Not critical: the choice just won't be remembered.
  }
  const url = new URL(window.location.href)
  url.searchParams.set('lang', code)
  window.history.replaceState(null, '', url)
}
