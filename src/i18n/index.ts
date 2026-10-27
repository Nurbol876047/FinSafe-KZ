import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import kk from './kk.json'
import ru from './ru.json'

export const LOCALE_STORAGE_KEY = 'finsafe.locale'

function readStoredLocale(): 'ru' | 'kk' {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'ru' || stored === 'kk') return stored
  } catch {
    // localStorage unavailable (private mode, etc.) — fall back to default
  }
  return 'ru'
}

void i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    kk: { translation: kk },
  },
  lng: readStoredLocale(),
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
  returnNull: false,
})

export function setLocale(locale: 'ru' | 'kk') {
  void i18n.changeLanguage(locale)
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // ignore persistence failures
  }
}

export default i18n
