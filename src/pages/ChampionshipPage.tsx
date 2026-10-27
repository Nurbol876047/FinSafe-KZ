import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { leaderboardApi } from '@/api/leaderboardApi'
import { progressApi } from '@/api/progressApi'
import { Container } from '@/components/Container'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Skeleton } from '@/components/Skeleton'
import { Tabs } from '@/components/Tabs'
import { AchievementBadge } from '@/features/championship/AchievementBadge'
import { LeaderboardTable } from '@/features/championship/LeaderboardTable'
import { TournamentCalendar } from '@/features/championship/TournamentCalendar'
import { useAsync } from '@/hooks/useAsync'
import type { LeaderboardScope } from '@/types'

const scopes: LeaderboardScope[] = ['week', 'month', 'season', 'teams', 'institutions']

export default function ChampionshipPage() {
  const { t } = useTranslation()
  const [scope, setScope] = useState<LeaderboardScope>('week')

  const leaderboardState = useAsync(() => leaderboardApi.getLeaderboard(scope), [scope])
  const tournamentsState = useAsync(() => leaderboardApi.getTournaments(), [])
  const achievementsState = useAsync(() => leaderboardApi.getAchievements(), [])
  const progressState = useAsync(() => progressApi.getProgress(), [])

  const unlockedIds = new Set(progressState.status === 'success' ? progressState.data.unlockedAchievementIds : [])

  return (
    <>
      <Helmet>
        <title>{t('championship.pageTitle')} — FINSAFE KZ</title>
      </Helmet>
      <Container className="flex flex-col gap-8 py-8">
        <div>
          <h1 className="text-2xl font-bold text-app-text">{t('championship.pageTitle')}</h1>
          <p className="mt-1 text-app-text-secondary">{t('championship.pageSubtitle')}</p>
        </div>

        <section className="flex flex-col gap-4">
          <Tabs
            activeId={scope}
            onChange={(id) => setScope(id as LeaderboardScope)}
            tabs={scopes.map((item) => ({ id: item, label: t(`championship.tabs.${item}`) }))}
          />
          {leaderboardState.status === 'loading' && <Skeleton className="h-64 w-full" />}
          {leaderboardState.status === 'error' && <ErrorState onRetry={leaderboardState.retry} />}
          {leaderboardState.status === 'success' &&
            (leaderboardState.data.length === 0 ? (
              <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
            ) : (
              <LeaderboardTable entries={leaderboardState.data} />
            ))}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-app-text">{t('championship.achievements')}</h2>
          {achievementsState.status === 'loading' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
            </div>
          )}
          {achievementsState.status === 'error' && <ErrorState onRetry={achievementsState.retry} />}
          {achievementsState.status === 'success' &&
            (achievementsState.data.length === 0 ? (
              <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {achievementsState.data.map((achievement) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} unlocked={unlockedIds.has(achievement.id)} />
                ))}
              </div>
            ))}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-app-text">{t('championship.calendar')}</h2>
          {tournamentsState.status === 'loading' && <Skeleton className="h-48 w-full" />}
          {tournamentsState.status === 'error' && <ErrorState onRetry={tournamentsState.retry} />}
          {tournamentsState.status === 'success' &&
            (tournamentsState.data.length === 0 ? (
              <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
            ) : (
              <TournamentCalendar tournaments={tournamentsState.data} />
            ))}
        </section>
      </Container>
    </>
  )
}
