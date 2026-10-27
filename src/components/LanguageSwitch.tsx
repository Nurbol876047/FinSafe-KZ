import { useTranslation } from 'react-i18next'

import { useLocaleSwitch } from '@/hooks/useLocale'

export function LanguageSwitch() {
  const { locale, switchTo } = useLocaleSwitch()
  const { t } = useTranslation()

  return (
    <div
      className="inline-flex rounded-full border border-black/10 bg-black/[0.03] p-1 text-xs font-medium"
      role="group"
      aria-label={t('nav.langSwitch')}
    >
      <button
        type="button"
        onClick={() => switchTo('kk')}
        aria-pressed={locale === 'kk'}
        className={`rounded-full px-3 py-1.5 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary ${
          locale === 'kk' ? 'bg-app-primary text-white' : 'text-app-text-secondary hover:text-app-text'
        }`}
      >
        ҚАЗ
      </button>
      <button
        type="button"
        onClick={() => switchTo('ru')}
        aria-pressed={locale === 'ru'}
        className={`rounded-full px-3 py-1.5 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary ${
          locale === 'ru' ? 'bg-app-primary text-white' : 'text-app-text-secondary hover:text-app-text'
        }`}
      >
        РУС
      </button>
    </div>
  )
}
