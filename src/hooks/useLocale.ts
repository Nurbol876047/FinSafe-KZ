import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { setLocale } from '@/i18n'
import type { Locale, LocalizedText } from '@/types'

export function useLocale(): Locale {
  const { i18n } = useTranslation()
  return i18n.language === 'kk' ? 'kk' : 'ru'
}

/** Returns a getter that picks the right field of a LocalizedText for the current UI language. */
export function useLocalizedText() {
  const locale = useLocale()
  return useCallback((text: LocalizedText) => text[locale], [locale])
}

export function useLocaleSwitch() {
  const locale = useLocale()
  const switchTo = useCallback((next: Locale) => setLocale(next), [])
  return { locale, switchTo }
}
