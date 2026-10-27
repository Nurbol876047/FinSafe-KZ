import { Award, Check, Gamepad2, GraduationCap, Pencil, User, X } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { coursesApi } from '@/api/coursesApi'
import { gamesApi } from '@/api/gamesApi'
import { leaderboardApi } from '@/api/leaderboardApi'
import { progressApi } from '@/api/progressApi'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Skeleton } from '@/components/Skeleton'
import { AchievementBadge } from '@/features/championship/AchievementBadge'
import { useAsync } from '@/hooks/useAsync'
import { useLocalizedText } from '@/hooks/useLocale'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })

export default function ProfilePage() {
  const { t } = useTranslation()
  const text = useLocalizedText()
  const [editing, setEditing] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')

  const state = useAsync(
    () =>
      Promise.all([
        progressApi.getProgress(),
        coursesApi.getCourses(),
        gamesApi.getGames(),
        leaderboardApi.getAchievements(),
      ]),
    [],
  )

  async function handleSaveNickname() {
    const trimmed = nicknameInput.trim()
    if (trimmed) {
      await progressApi.updateProfile({ nickname: trimmed })
    }
    setEditing(false)
    state.retry()
  }

  return (
    <>
      <Helmet>
        <title>{t('profile.pageTitle')} — FINSAFE KZ</title>
      </Helmet>
      <Container className="flex flex-col gap-8 py-8">
        <h1 className="text-2xl font-bold text-app-text">{t('profile.pageTitle')}</h1>

        {state.status === 'loading' && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}
        {state.status === 'error' && <ErrorState onRetry={state.retry} />}
        {state.status === 'success' &&
          (() => {
            const [progress, courses, games, achievements] = state.data
            const passedCourseIds = new Set(
              progress.finalTestResults.filter((result) => result.scorePercent >= 80).map((result) => result.courseId),
            )
            const startedCourseIds = Array.from(
              new Set([
                ...progress.completedLessons.map((entry) => entry.courseId),
                ...progress.finalTestResults.map((result) => result.courseId),
              ]),
            )
            const startedCourses = startedCourseIds
              .map((courseId) => courses.find((course) => course.id === courseId))
              .filter((course): course is NonNullable<typeof course> => Boolean(course))
            const sortedAttempts = [...progress.gameAttempts].sort(
              (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
            )

            return (
              <>
                <Card className="flex flex-wrap items-center gap-5 p-5">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-app-text"
                    style={{ backgroundColor: progress.profile.avatarColor }}
                  >
                    <User size={28} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    {editing ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          autoFocus
                          value={nicknameInput}
                          onChange={(event) => setNicknameInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') void handleSaveNickname()
                            if (event.key === 'Escape') setEditing(false)
                          }}
                          className="rounded-full border border-black/10 bg-black/[0.04] px-4 py-2 text-base font-semibold text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary"
                        />
                        <button
                          type="button"
                          onClick={handleSaveNickname}
                          aria-label={t('common.save')}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-app-primary/10 text-app-primary transition duration-200 hover:bg-app-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary"
                        >
                          <Check size={16} strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          aria-label={t('common.cancel')}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.05] text-app-text-secondary transition duration-200 hover:bg-black/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary"
                        >
                          <X size={16} strokeWidth={1.75} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-app-text">{progress.profile.nickname}</h2>
                        <button
                          type="button"
                          onClick={() => {
                            setNicknameInput(progress.profile.nickname)
                            setEditing(true)
                          }}
                          aria-label={t('profile.editNickname')}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] text-app-text-secondary transition duration-200 hover:bg-black/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary"
                        >
                          <Pencil size={14} strokeWidth={1.75} />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard icon={GraduationCap} value={passedCourseIds.size} label={t('profile.coursesCompleted')} />
                  <StatCard icon={Gamepad2} value={progress.gameAttempts.length} label={t('profile.gamesPlayed')} />
                  <StatCard icon={Award} value={progress.unlockedAchievementIds.length} label={t('profile.achievementsUnlocked')} />
                </div>

                <section>
                  <h2 className="mb-4 text-xl font-bold text-app-text">{t('profile.coursesTitle')}</h2>
                  {startedCourses.length === 0 ? (
                    <EmptyState
                      title={t('profile.noCourses')}
                      action={
                        <Link to="/academy">
                          <Button variant="secondary" size="sm">
                            {t('profile.goToAcademy')}
                          </Button>
                        </Link>
                      }
                    />
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {startedCourses.map((course) => {
                        const completed = progress.completedLessons.filter((entry) => entry.courseId === course.id).length
                        const passed = passedCourseIds.has(course.id)
                        return (
                          <Link
                            key={course.id}
                            to={`/academy/${course.slug}`}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-black/[0.08] bg-black/[0.02] px-4 py-3 transition duration-200 hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary"
                          >
                            <span className="text-sm font-medium text-app-text">{text(course.title)}</span>
                            <div className="flex items-center gap-2 text-xs text-app-text-secondary">
                              <span>{t('academy.course.progress', { done: completed, total: course.lessons.length })}</span>
                              {passed && <Badge tone="primary">{t('academy.course.testPassed')}</Badge>}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </section>

                <section>
                  <h2 className="mb-4 text-xl font-bold text-app-text">{t('profile.gamesTitle')}</h2>
                  {sortedAttempts.length === 0 ? (
                    <EmptyState
                      title={t('profile.noGames')}
                      action={
                        <Link to="/games">
                          <Button variant="secondary" size="sm">
                            {t('profile.goToGames')}
                          </Button>
                        </Link>
                      }
                    />
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {sortedAttempts.map((attempt) => {
                        const game = games.find((item) => item.id === attempt.gameId)
                        return (
                          <div
                            key={attempt.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-black/[0.08] bg-black/[0.02] px-4 py-3"
                          >
                            <span className="text-sm font-medium text-app-text">{game ? text(game.title) : attempt.gameId}</span>
                            <div className="flex items-center gap-3 text-xs text-app-text-secondary">
                              <span className="font-semibold text-app-primary">
                                {attempt.score} / {attempt.maxScore}
                              </span>
                              <span>{dateFormatter.format(new Date(attempt.completedAt))}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>

                <section>
                  <h2 className="mb-4 text-xl font-bold text-app-text">{t('profile.achievementsTitle')}</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {achievements.map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        unlocked={progress.unlockedAchievementIds.includes(achievement.id)}
                      />
                    ))}
                  </div>
                  {progress.unlockedAchievementIds.length === 0 && (
                    <p className="mt-3 text-sm text-app-text-secondary">{t('profile.noAchievements')}</p>
                  )}
                </section>
              </>
            )
          })()}
      </Container>
    </>
  )
}

function StatCard({ icon: Icon, value, label }: { icon: typeof User; value: number; label: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-app-primary/10 text-app-primary">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-xl font-bold text-app-text">{value}</p>
        <p className="text-xs text-app-text-secondary">{label}</p>
      </div>
    </Card>
  )
}
