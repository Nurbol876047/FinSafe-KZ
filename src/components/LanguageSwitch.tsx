import { useTranslation } from 'react-i18next'

import { useLocaleSwitch } from '@/hooks/useLocale'

export function LanguageSwitch() {
  const { locale, switchTo } = useLocaleSwitch()
  const { t } = useTranslation()

  return (
    <div
      className="inline-flex rounded-full border border-white/25 bg-white/10 p-1 text-xs font-medium"
      role="group"
      aria-label={t('nav.langSwitch')}
    >
      <button
        type="button"
        onClick={() => switchTo('kk')}
        aria-pressed={locale === 'kk'}
        className={`rounded-full px-3 py-1.5 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-app-navy ${
          locale === 'kk' ? 'bg-white text-app-primary' : 'text-white/70 hover:text-white'
        }`}
      >
        ҚАЗ
      </button>
      <button
        type="button"
        onClick={() => switchTo('ru')}
        aria-pressed={locale === 'ru'}
        className={`rounded-full px-3 py-1.5 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-app-navy ${
          locale === 'ru' ? 'bg-white text-app-primary' : 'text-white/70 hover:text-white'
        }`}
      >
        РУС
      </button>
    </div>
  )
}
