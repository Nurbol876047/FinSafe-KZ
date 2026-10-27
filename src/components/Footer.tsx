import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-black/[0.06] px-4 py-6 text-center text-xs text-app-text-secondary/70 sm:px-8">
      {t('footer.rights')}
    </footer>
  )
}
