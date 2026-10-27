import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { gamesApi } from '@/api/gamesApi'
import { progressApi } from '@/api/progressApi'
import { Container } from '@/components/Container'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Skeleton } from '@/components/Skeleton'
import { GameRunner } from '@/features/games/GameRunner'
import { useAsync } from '@/hooks/useAsync'
import { useLocalizedText } from '@/hooks/useLocale'
import type { GameAttempt, GameAttemptAnswer } from '@/types'

export default function GamePlayPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const text = useLocalizedText()
  const state = useAsync(() => gamesApi.getGameBySlug(id ?? ''), [id])

  async function handleComplete(score: number, maxScore: number, answers: GameAttemptAnswer[]) {
    if (state.status !== 'success' || !state.data) return
    const game = state.data
    const progress = await progressApi.getProgress()
    const isFirstEver = progress.gameAttempts.length === 0

    const attempt: GameAttempt = {
      id: `${game.id}-${Date.now()}`,
      gameId: game.id,
      score,
      maxScore,
      completedAt: new Date().toISOString(),
      answers,
    }
    await progressApi.recordGameAttempt(attempt)

    const unlocks: string[] = []
    if (isFirstEver) unlocks.push('ach-first-game')
    if (maxScore > 0 && score === maxScore) unlocks.push('ach-perfect-score')
    const playedGameIds = new Set([...progress.gameAttempts.map((entry) => entry.gameId), game.id])
    if (playedGameIds.size >= 4) unlocks.push('ach-all-games')
    if (unlocks.length > 0) await progressApi.unlockAchievements(unlocks)
  }

  return (
    <Container className="flex flex-col gap-6 py-8">
      {state.status === 'loading' && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}
      {state.status === 'error' && <ErrorState onRetry={state.retry} />}
      {state.status === 'success' &&
        (state.data ? (
          <>
            <h1 className="text-2xl font-bold text-app-text">{text(state.data.title)}</h1>
            <GameRunner key={state.data.id} game={state.data} onComplete={handleComplete} />
          </>
        ) : (
          <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
        ))}
    </Container>
  )
}
