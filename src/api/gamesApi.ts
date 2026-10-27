import { games } from '@/mocks/games'
import type { Game } from '@/types'

import { cloneValue, withDelay } from './helpers'

async function getGames(): Promise<Game[]> {
  return withDelay(cloneValue(games))
}

async function getGameBySlug(slug: string): Promise<Game | null> {
  const found = games.find((game) => game.slug === slug) ?? null
  return withDelay(found ? cloneValue(found) : null)
}

export const gamesApi = {
  getGames,
  getGameBySlug,
}
