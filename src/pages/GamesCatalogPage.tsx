import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { gamesApi } from '@/api/gamesApi'
import { Container } from '@/components/Container'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { SkeletonCard } from '@/components/Skeleton'
import { GameCard } from '@/features/games/GameCard'
import { useAsync } from '@/hooks/useAsync'

export default function GamesCatalogPage() {
  const { t } = useTranslation()
  const state = useAsync(() => gamesApi.getGames(), [])

  return (
    <>
      <Helmet>
        <title>{t('games.pageTitle')} — FINSAFE KZ</title>
      </Helmet>
      <Container className="flex flex-col gap-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-app-text">{t('games.pageTitle')}</h1>
          <p className="mt-1 text-app-text-secondary">{t('games.pageSubtitle')}</p>
        </div>

        {state.status === 'loading' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}
        {state.status === 'error' && <ErrorState onRetry={state.retry} />}
        {state.status === 'success' &&
          (state.data.length === 0 ? (
            <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {state.data.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ))}
      </Container>
    </>
  )
}
