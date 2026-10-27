import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { coursesApi } from '@/api/coursesApi'
import { progressApi } from '@/api/progressApi'
import { Container } from '@/components/Container'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { SkeletonCard } from '@/components/Skeleton'
import { Tabs } from '@/components/Tabs'
import { CourseCard } from '@/features/academy/CourseCard'
import { useAsync } from '@/hooks/useAsync'
import type { CourseAudience, CourseTopic, Difficulty } from '@/types'

const audiences: CourseAudience[] = ['school', 'student', 'adult', 'senior']
const topics: CourseTopic[] = ['phishing', 'credit', 'investment', 'cards', 'social-engineering', 'digital-hygiene']
const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

export default function AcademyCatalogPage() {
  const { t } = useTranslation()
  const coursesState = useAsync(() => coursesApi.getCourses(), [])
  const progressState = useAsync(() => progressApi.getProgress(), [])

  const [audience, setAudience] = useState<CourseAudience | 'all'>('all')
  const [topic, setTopic] = useState<CourseTopic | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')

  const filtered = useMemo(() => {
    if (coursesState.status !== 'success') return []
    return coursesState.data.filter(
      (course) =>
        (audience === 'all' || course.audience.includes(audience)) &&
        (topic === 'all' || course.topics.includes(topic)) &&
        (difficulty === 'all' || course.difficulty === difficulty),
    )
  }, [coursesState, audience, topic, difficulty])

  const progress = progressState.status === 'success' ? progressState.data : null

  return (
    <>
      <Helmet>
        <title>{t('academy.pageTitle')} — FINSAFE KZ</title>
      </Helmet>
      <Container className="flex flex-col gap-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-app-text">{t('academy.pageTitle')}</h1>
          <p className="mt-1 text-app-text-secondary">{t('academy.pageSubtitle')}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-2 text-xs font-medium text-app-text-secondary">{t('academy.filters.audience')}</p>
            <Tabs
              activeId={audience}
              onChange={(id) => setAudience(id as CourseAudience | 'all')}
              tabs={[
                { id: 'all', label: t('academy.filters.all') },
                ...audiences.map((item) => ({ id: item, label: t(`academy.filters.audienceOptions.${item}`) })),
              ]}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-app-text-secondary">{t('academy.filters.topic')}</p>
            <Tabs
              activeId={topic}
              onChange={(id) => setTopic(id as CourseTopic | 'all')}
              tabs={[
                { id: 'all', label: t('academy.filters.all') },
                ...topics.map((item) => ({ id: item, label: t(`academy.filters.topicOptions.${item}`) })),
              ]}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-app-text-secondary">{t('academy.filters.difficulty')}</p>
            <Tabs
              activeId={difficulty}
              onChange={(id) => setDifficulty(id as Difficulty | 'all')}
              tabs={[
                { id: 'all', label: t('academy.filters.all') },
                ...difficulties.map((item) => ({ id: item, label: t(`common.difficulty.${item}`) })),
              ]}
            />
          </div>
        </div>

        {coursesState.status === 'loading' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}
        {coursesState.status === 'error' && <ErrorState onRetry={coursesState.retry} />}
        {coursesState.status === 'success' &&
          (filtered.length === 0 ? (
            <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => {
                const completedLessons = progress?.completedLessons.filter((entry) => entry.courseId === course.id).length ?? 0
                return <CourseCard key={course.id} course={course} completedLessons={completedLessons} />
              })}
            </div>
          ))}
      </Container>
    </>
  )
}
