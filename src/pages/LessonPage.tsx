import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { coursesApi } from '@/api/coursesApi'
import { progressApi } from '@/api/progressApi'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Skeleton } from '@/components/Skeleton'
import { LessonQuestion } from '@/features/academy/LessonQuestion'
import { useAsync } from '@/hooks/useAsync'
import { useLocalizedText } from '@/hooks/useLocale'

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const { t } = useTranslation()
  const text = useLocalizedText()
  const navigate = useNavigate()

  const courseState = useAsync(() => coursesApi.getCourseBySlug(courseId ?? ''), [courseId])
  const [answered, setAnswered] = useState(false)

  const lesson =
    courseState.status === 'success' && courseState.data
      ? courseState.data.lessons.find((item) => item.id === lessonId) ?? null
      : null

  useEffect(() => {
    setAnswered(false)
    let cancelled = false
    async function checkAlreadyCompleted() {
      if (courseState.status !== 'success' || !courseState.data || !lesson) return
      const progress = await progressApi.getProgress()
      const alreadyDone = progress.completedLessons.some(
        (entry) => entry.courseId === courseState.data!.id && entry.lessonId === lesson.id,
      )
      if (!cancelled && alreadyDone) setAnswered(true)
    }
    void checkAlreadyCompleted()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseState.status, lessonId])

  async function handleAnswer() {
    if (courseState.status !== 'success' || !courseState.data || !lesson) return
    await progressApi.completeLesson(courseState.data.id, lesson.id)
    setAnswered(true)
  }

  function handleNext() {
    if (courseState.status !== 'success' || !courseState.data) return
    const course = courseState.data
    const index = course.lessons.findIndex((item) => item.id === lessonId)
    const nextLesson = course.lessons[index + 1]
    if (nextLesson) {
      navigate(`/academy/${course.slug}/${nextLesson.id}`)
    } else {
      navigate(`/academy/${course.slug}`)
    }
  }

  const isLastLesson =
    courseState.status === 'success' && courseState.data
      ? courseState.data.lessons.findIndex((item) => item.id === lessonId) === courseState.data.lessons.length - 1
      : false

  return (
    <Container className="flex max-w-2xl flex-col gap-6 py-8">
      {courseState.status === 'loading' && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}
      {courseState.status === 'error' && <ErrorState onRetry={courseState.retry} />}
      {courseState.status === 'success' &&
        (!courseState.data || !lesson ? (
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
          <>
            <Helmet>
              <title>{text(lesson.title)} — FINSAFE KZ</title>
            </Helmet>

            <Link
              to={`/academy/${courseState.data.slug}`}
              className="text-sm font-medium text-app-text-secondary hover:text-app-text hover:underline"
            >
              ← {t('academy.lesson.backToCourse')}
            </Link>

            <h1 className="text-2xl font-bold text-app-text">{text(lesson.title)}</h1>

            <LessonSection title={t('academy.lesson.goal')} body={text(lesson.goal)} />
            <LessonSection title={t('academy.lesson.explanation')} body={text(lesson.explanation)} />
            <LessonSection title={t('academy.lesson.material')} body={text(lesson.material)} />
            <LessonSection title={t('academy.lesson.example')} body={text(lesson.practicalExample)} />

            <section>
              <h2 className="mb-3 text-lg font-semibold text-app-text">{t('academy.lesson.question')}</h2>
              <LessonQuestion question={lesson.interactiveQuestion} answered={answered} onAnswer={handleAnswer} />
            </section>

            {answered && (
              <>
                <LessonSection title={t('academy.lesson.conclusion')} body={text(lesson.conclusion)} />
                <div className="flex justify-end">
                  <Button onClick={handleNext}>
                    {isLastLesson ? t('academy.lesson.finishCourse') : t('academy.lesson.nextLesson')}
                  </Button>
                </div>
              </>
            )}
          </>
        ))}
    </Container>
  )
}

function LessonSection({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-app-text-secondary">{title}</h2>
      <p className="text-sm leading-relaxed text-app-text">{body}</p>
    </section>
  )
}
