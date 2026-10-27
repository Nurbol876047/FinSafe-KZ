import { BookOpen, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/Badge'
import { Card, CardLink } from '@/components/Card'
import { useLocalizedText } from '@/hooks/useLocale'
import type { Course } from '@/types'

export function CourseCard({ course, completedLessons = 0 }: { course: Course; completedLessons?: number }) {
  const { t } = useTranslation()
  const text = useLocalizedText()
  const isCompleted = course.lessons.length > 0 && completedLessons >= course.lessons.length

  if (course.status === 'coming-soon') {
    return (
      <Card className="flex h-full flex-col gap-4 p-5 opacity-80">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.05] text-app-text-secondary">
            <BookOpen size={20} strokeWidth={1.75} />
          </div>
          <Badge tone="muted">{t('common.comingSoon')}</Badge>
        </div>
        <div className="flex-1">
          <h3 className="mb-1 text-base font-semibold text-app-text">{text(course.title)}</h3>
          <p className="line-clamp-2 text-sm text-app-text-secondary">{text(course.description)}</p>
        </div>
      </Card>
    )
  }

  return (
    <CardLink to={`/academy/${course.slug}`} className="flex h-full flex-col gap-4 p-5" aria-label={text(course.title)}>
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-app-primary-soft text-app-primary">
          <BookOpen size={20} strokeWidth={1.75} />
        </div>
        <Badge tone={course.difficulty}>{t(`common.difficulty.${course.difficulty}`)}</Badge>
      </div>
      <div className="flex-1">
        <h3 className="mb-1 text-base font-semibold text-app-text">{text(course.title)}</h3>
        <p className="line-clamp-2 text-sm text-app-text-secondary">{text(course.description)}</p>
      </div>
      <div className="flex items-center gap-4 border-t border-app-card-border pt-3 text-xs text-app-text-secondary">
        <span className="flex items-center gap-1">
          <BookOpen size={14} strokeWidth={1.75} />
          {t('common.lessons', { count: course.lessons.length })}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} strokeWidth={1.75} />
          {t('common.minutesShort', { count: course.durationMinutes })}
        </span>
      </div>
      {isCompleted ? (
        <span className="rounded-full bg-app-primary-soft px-3 py-1.5 text-center text-xs font-medium text-app-primary">
          {t('academy.card.completed')}
        </span>
      ) : completedLessons > 0 ? (
        <span className="rounded-full bg-black/[0.05] px-3 py-1.5 text-center text-xs font-medium text-app-text">
          {t('academy.card.continue', { n: completedLessons + 1 })}
        </span>
      ) : (
        <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-center text-xs font-medium text-app-text-secondary">
          {t('academy.card.start')}
        </span>
      )}
    </CardLink>
  )
}
