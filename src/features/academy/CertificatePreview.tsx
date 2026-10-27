import { Award, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/Card'

interface CertificatePreviewProps {
  unlocked: boolean
  courseTitle: string
  nickname: string
}

export function CertificatePreview({ unlocked, courseTitle, nickname }: CertificatePreviewProps) {
  const { t } = useTranslation()

  if (!unlocked) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed bg-black/[0.02] p-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.05] text-app-text-secondary">
          <Lock size={20} strokeWidth={1.75} />
        </div>
        <p className="font-medium text-app-text">{t('academy.course.certificateTitle')}</p>
        <p className="max-w-sm text-sm text-app-text-secondary">{t('academy.course.certificateLocked')}</p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col items-center gap-3 bg-gradient-to-b from-app-primary/10 to-transparent p-6 text-center">
      <span className="rounded-full bg-app-primary/15 px-3 py-1 text-xs font-medium text-app-primary">
        {t('academy.course.certificatePreview')}
      </span>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-app-primary/15 text-app-primary">
        <Award size={28} strokeWidth={1.75} />
      </div>
      <p className="text-sm text-app-text-secondary">
        {t('academy.course.certificateIssuedTo')}: <span className="font-medium text-app-text">{nickname}</span>
      </p>
      <h3 className="text-lg font-semibold text-app-text">{courseTitle}</h3>
      <p className="text-sm text-app-text-secondary">{t('academy.course.certificateFor')}</p>
      <p className="mt-2 text-xs text-app-text-secondary/70">{t('academy.course.certificateDocBody')}</p>
    </Card>
  )
}
