import { GraduationCap, Joystick, Newspaper, Trophy } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { coursesApi } from '@/api/coursesApi'
import { gamesApi } from '@/api/gamesApi'
import { leaderboardApi } from '@/api/leaderboardApi'
import { mediaApi } from '@/api/mediaApi'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Card, CardLink } from '@/components/Card'
import { Container } from '@/components/Container'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Modal } from '@/components/Modal'
import { Skeleton, SkeletonCard } from '@/components/Skeleton'
import { CourseCard } from '@/features/academy/CourseCard'
import { LeaderboardTable } from '@/features/championship/LeaderboardTable'
import { GameCard } from '@/features/games/GameCard'
import { MediaCard } from '@/features/media/MediaCard'
import { MediaPostDetails } from '@/features/media/MediaPostDetails'
import { useAsync } from '@/hooks/useAsync'
import { useLocalizedText } from '@/hooks/useLocale'
import type { MediaPost } from '@/types'

const sectionCards = [
  { to: '/games', key: 'games', icon: Joystick },
  { to: '/academy', key: 'academy', icon: GraduationCap },
  { to: '/championship', key: 'championship', icon: Trophy },
  { to: '/media', key: 'media', icon: Newspaper },
] as const

function HomeSection({ title, viewAllTo, children }: { title: string; viewAllTo: string; children: ReactNode }) {
  const { t } = useTranslation()
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-app-text">{title}</h2>
        <Link to={viewAllTo} className="text-sm font-medium text-app-link hover:underline">
          {t('home.viewAll')}
        </Link>
      </div>
      {children}
    </section>
  )
}

function CardGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function CardGridSkeleton({ count }: { count: number }) {
  return (
    <CardGrid>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </CardGrid>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  const text = useLocalizedText()
  const [activePost, setActivePost] = useState<MediaPost | null>(null)

  const gamesState = useAsync(() => gamesApi.getGames(), [])
  const coursesState = useAsync(() => coursesApi.getCourses(), [])
  const tournamentsState = useAsync(() => leaderboardApi.getTournaments(), [])
  const weekState = useAsync(() => leaderboardApi.getLeaderboard('week'), [])
  const mediaState = useAsync(() => mediaApi.getMediaPosts(), [])

  const activeTournament =
    tournamentsState.status === 'success'
      ? tournamentsState.data.find((item) => item.status === 'active') ?? tournamentsState.data[0]
      : null

  return (
    <>
      <Helmet>
        <title>FINSAFE KZ — проверь свою финансовую безопасность</title>
        <meta
          name="description"
          content="Образовательная платформа о финансовой безопасности: игры, курсы и чемпионаты по распознаванию мошенничества в Казахстане."
        />
        <meta property="og:title" content="FINSAFE KZ" />
        <meta
          property="og:description"
          content="Играй. Учись. Распознавай мошенников."
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
      </Helmet>

      <section className="bg-gradient-to-br from-app-navy to-app-primary pt-14 pb-20 text-center sm:pt-20 sm:pb-28">
        <Container>
          <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            {t('home.title')}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-app-navy-subtle">{t('home.subtitle')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/academy">
              <Button variant="heroPrimary">{t('home.ctaButton')}</Button>
            </Link>
            <Link to="/games">
              <Button variant="heroOutline">{t('home.heroStartTest')}</Button>
            </Link>
          </div>
        </Container>
      </section>

      <Container className="flex flex-col gap-14 pb-16">
        <section className="-mt-12 grid grid-cols-2 gap-4 sm:-mt-16 lg:grid-cols-4">
          {sectionCards.map(({ to, key, icon: Icon }) => (
            <CardLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-3 p-6 text-center"
              aria-label={t(`home.sections.${key}.title`)}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-app-primary-soft text-app-primary">
                <Icon size={26} strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-base font-bold text-app-text">{t(`home.sections.${key}.title`)}</h2>
                <p className="mt-1 text-sm text-app-text-secondary">{t(`home.sections.${key}.tagline`)}</p>
              </div>
            </CardLink>
          ))}
        </section>

        <HomeSection title={t('home.popularGames')} viewAllTo="/games">
          {gamesState.status === 'loading' && <CardGridSkeleton count={3} />}
          {gamesState.status === 'error' && <ErrorState onRetry={gamesState.retry} />}
          {gamesState.status === 'success' &&
            (gamesState.data.length === 0 ? (
              <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
            ) : (
              <CardGrid>
                {gamesState.data.slice(0, 3).map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </CardGrid>
            ))}
        </HomeSection>

        <HomeSection title={t('home.recommendedCourses')} viewAllTo="/academy">
          {coursesState.status === 'loading' && <CardGridSkeleton count={3} />}
          {coursesState.status === 'error' && <ErrorState onRetry={coursesState.retry} />}
          {coursesState.status === 'success' &&
            (() => {
              const available = coursesState.data.filter((course) => course.status === 'available')
              return available.length === 0 ? (
                <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
              ) : (
                <CardGrid>
                  {available.slice(0, 3).map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </CardGrid>
              )
            })()}
        </HomeSection>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-bold text-app-text">{t('home.currentChampionship')}</h2>
            {tournamentsState.status === 'loading' && <Skeleton className="h-36 w-full" />}
            {tournamentsState.status === 'error' && <ErrorState onRetry={tournamentsState.retry} />}
            {tournamentsState.status === 'success' &&
              (activeTournament ? (
                <Card className="flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <Badge tone="primary">{t(`championship.status.${activeTournament.status}`)}</Badge>
                    <span className="text-xs text-app-text-secondary">
                      {new Date(activeTournament.startDate).toLocaleDateString('ru-RU')} —{' '}
                      {new Date(activeTournament.endDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-app-text">{text(activeTournament.title)}</h3>
                  <p className="text-sm text-app-text-secondary">{text(activeTournament.description)}</p>
                  <Link to="/championship" className="mt-2 w-fit">
                    <Button variant="secondary" size="sm">
                      {t('home.viewAll')}
                    </Button>
                  </Link>
                </Card>
              ) : (
                <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
              ))}
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-app-text">{t('home.topWeek')}</h2>
            {weekState.status === 'loading' && <Skeleton className="h-36 w-full" />}
            {weekState.status === 'error' && <ErrorState onRetry={weekState.retry} />}
            {weekState.status === 'success' &&
              (weekState.data.length === 0 ? (
                <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
              ) : (
                <LeaderboardTable entries={weekState.data.slice(0, 5)} />
              ))}
          </div>
        </section>

        <HomeSection title={t('home.latestMedia')} viewAllTo="/media">
          {mediaState.status === 'loading' && <CardGridSkeleton count={3} />}
          {mediaState.status === 'error' && <ErrorState onRetry={mediaState.retry} />}
          {mediaState.status === 'success' &&
            (mediaState.data.length === 0 ? (
              <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
            ) : (
              <CardGrid>
                {mediaState.data.slice(0, 3).map((post) => (
                  <MediaCard key={post.id} post={post} onOpen={setActivePost} />
                ))}
              </CardGrid>
            ))}
        </HomeSection>

        <section className="rounded-container bg-black/[0.025] px-6 py-10 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-app-text">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mt-2 max-w-md text-app-text-secondary">{t('home.ctaBody')}</p>
          <Link to="/academy" className="mt-6 inline-block">
            <Button variant="primary">{t('home.ctaButton')}</Button>
          </Link>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-app-text">{t('home.aboutTitle')}</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-app-text-secondary">{t('home.aboutBody')}</p>
        </section>
      </Container>

      <Modal open={activePost !== null} onClose={() => setActivePost(null)} title={activePost ? text(activePost.title) : ''}>
        {activePost ? <MediaPostDetails post={activePost} /> : null}
      </Modal>
    </>
  )
}
