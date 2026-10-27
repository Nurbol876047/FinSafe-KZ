import { ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/[0.05] text-app-primary">
        <ShieldAlert size={32} strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl font-bold text-app-text">{t('notFound.title')}</h1>
      <p className="max-w-sm text-app-text-secondary">{t('notFound.body')}</p>
      <Link to="/">
        <Button variant="primary">{t('notFound.action')}</Button>
      </Link>
    </Container>
  )
}
