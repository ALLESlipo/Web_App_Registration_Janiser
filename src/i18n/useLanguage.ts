import { useContext } from 'react'
import { LanguageContext } from './context'

export function useLanguage() {
  const state = useContext(LanguageContext)
  if (!state) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return state
}
