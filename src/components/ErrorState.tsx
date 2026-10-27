import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from './Button'

interface ErrorStateProps {
  onRetry: () => void
  className?: string
}

export function ErrorState({ onRetry, className = '' }: ErrorStateProps) {
  const { t } = useTranslation()
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-card border border-rose-400/20 bg-rose-400/[0.04] px-6 py-12 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-400/10 text-rose-600">
        <AlertTriangle size={22} strokeWidth={1.75} />
      </div>
      <p className="font-medium text-app-text">{t('common.errorTitle')}</p>
      <p className="max-w-sm text-sm text-app-text-secondary">{t('common.errorBody')}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        {t('common.retry')}
      </Button>
    </div>
  )
}
