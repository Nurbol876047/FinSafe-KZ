import { CheckCircle2, Circle, Clock, FileQuestion } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { coursesApi } from '@/api/coursesApi'
import { progressApi } from '@/api/progressApi'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { ProgressBar } from '@/components/ProgressBar'
import { Skeleton } from '@/components/Skeleton'
import { CertificatePreview } from '@/features/academy/CertificatePreview'
import { FinalTest } from '@/features/academy/FinalTest'
import { useAsync } from '@/hooks/useAsync'
import { useLocalizedText } from '@/hooks/useLocale'

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { t } = useTranslation()
  const text = useLocalizedText()
  const [testOpen, setTestOpen] = useState(false)

  const courseState = useAsync(() => coursesApi.getCourseBySlug(courseId ?? ''), [courseId])
  const progressState = useAsync(() => progressApi.getProgress(), [])

  async function handleTestComplete(percent: number) {
    if (courseState.status !== 'success' || !courseState.data) return
    const course = courseState.data
    const before = progressState.status === 'success' ? progressState.data : await progressApi.getProgress()
    const alreadyPassedAnyCourse = before.finalTestResults.some((result) => result.scorePercent >= 80)

    await progressApi.saveFinalTestResult(course.id, percent)
    const unlocks: string[] = []
    if (percent >= 80) {
      unlocks.push('ach-certificate')
      if (!alreadyPassedAnyCourse) unlocks.push('ach-first-course')
    }
    if (unlocks.length > 0) await progressApi.unlockAchievements(unlocks)

    setTestOpen(false)
    progressState.retry()
  }

  return (
    <Container className="flex flex-col gap-6 py-8">
      {courseState.status === 'loading' && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}
      {courseState.status === 'error' && <ErrorState onRetry={courseState.retry} />}
      {courseState.status === 'success' &&
        (!courseState.data ? (
          <EmptyState
            title={t('common.empty.title')}
            body={t('common.empty.body')}
            action={
              <Link to="/academy">
                <Button variant="secondary" size="sm">
                  {t('academy.pageTitle')}
                </Button>
              </Link>
            }
          />
        ) : (
          <CourseContent
            course={courseState.data}
            progress={progressState.status === 'success' ? progressState.data : null}
            testOpen={testOpen}
            onOpenTest={() => setTestOpen(true)}
            onTestComplete={handleTestComplete}
            text={text}
            t={t}
          />
        ))}
    </Container>
  )
}

interface CourseContentProps {
  course: NonNullable<Awaited<ReturnType<typeof coursesApi.getCourseBySlug>>>
  progress: Awaited<ReturnType<typeof progressApi.getProgress>> | null
  testOpen: boolean
  onOpenTest: () => void
  onTestComplete: (percent: number) => void
  text: ReturnType<typeof useLocalizedText>
  t: ReturnType<typeof useTranslation>['t']
}

function CourseContent({ course, progress, testOpen, onOpenTest, onTestComplete, text, t }: CourseContentProps) {
  const completedLessonIds = new Set(
    (progress?.completedLessons ?? []).filter((entry) => entry.courseId === course.id).map((entry) => entry.lessonId),
  )
  const completedCount = completedLessonIds.size
  const totalLessons = course.lessons.length
  const allLessonsDone = totalLessons > 0 && completedCount >= totalLessons
  const storedResult = progress?.finalTestResults.find((result) => result.courseId === course.id)?.scorePercent ?? null
  const passed = storedResult !== null && storedResult >= 80
  const nickname = progress?.profile.nickname ?? ''

  return (
    <>
      <Helmet>
        <title>{text(course.title)} — FINSAFE KZ</title>
      </Helmet>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge tone={course.difficulty}>{t(`common.difficulty.${course.difficulty}`)}</Badge>
          <span className="flex items-center gap-1 text-xs text-app-text-secondary">
            <Clock size={14} strokeWidth={1.75} />
            {t('common.minutesShort', { count: course.durationMinutes })}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-app-text">{text(course.title)}</h1>
        <p className="mt-1 text-app-text-secondary">{text(course.description)}</p>
      </div>

      {totalLessons > 0 && (
        <div className="flex flex-col gap-2">
          <ProgressBar value={completedCount} max={totalLessons} />
          <span className="text-sm text-app-text-secondary">
            {t('academy.course.progress', { done: completedCount, total: totalLessons })}
          </span>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-app-text">{t('academy.course.lessonsTitle')}</h2>
        <div className="flex flex-col gap-2.5">
          {course.lessons.map((lesson) => {
            const isDone = completedLessonIds.has(lesson.id)
            return (
              <Link
                key={lesson.id}
                to={`/academy/${course.slug}/${lesson.id}`}
                className="flex items-center gap-3 rounded-card border border-black/[0.08] bg-black/[0.02] px-4 py-3 transition duration-200 hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary"
              >
                {isDone ? (
                  <CheckCircle2 size={20} strokeWidth={1.75} className="shrink-0 text-app-primary" />
                ) : (
                  <Circle size={20} strokeWidth={1.75} className="shrink-0 text-app-text-secondary" />
                )}
                <span className="flex-1 text-sm font-medium text-app-text">
                  {lesson.order}. {text(lesson.title)}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-app-text">{t('academy.course.finalTest')}</h2>
        {!allLessonsDone ? (
          <Card className="flex items-center gap-3 p-5">
            <FileQuestion size={24} strokeWidth={1.75} className="shrink-0 text-app-text-secondary" />
            <p className="text-sm text-app-text-secondary">{t('academy.course.finalTestLocked')}</p>
          </Card>
        ) : testOpen ? (
          <FinalTest questions={course.finalTest} onComplete={onTestComplete} />
        ) : (
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-3 p-5">
              <p className="text-sm text-app-text-secondary">{t('academy.course.finalTestBody')}</p>
              {storedResult !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-app-text-secondary">{t('academy.course.testResult')}:</span>
                  <Badge tone={passed ? 'primary' : 'medium'}>
                    {storedResult}% — {passed ? t('academy.course.testPassed') : t('academy.course.testFailed')}
                  </Badge>
                </div>
              )}
              <div>
                <Button onClick={onOpenTest} size="sm">
                  {storedResult !== null ? t('academy.course.retryTest') : t('academy.course.startTest')}
                </Button>
              </div>
            </Card>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-app-text">{t('academy.course.certificateTitle')}</h3>
              <CertificatePreview unlocked={passed} courseTitle={text(course.title)} nickname={nickname} />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
