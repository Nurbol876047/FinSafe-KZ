import { achievements, leaderboards, tournaments } from '@/mocks/championship'
import type { Achievement, LeaderboardEntry, LeaderboardScope, Tournament } from '@/types'

import { cloneValue, withDelay } from './helpers'

async function getLeaderboard(scope: LeaderboardScope): Promise<LeaderboardEntry[]> {
  return withDelay(cloneValue(leaderboards[scope]))
}

async function getTournaments(): Promise<Tournament[]> {
  return withDelay(cloneValue(tournaments))
}

async function getAchievements(): Promise<Achievement[]> {
  return withDelay(cloneValue(achievements))
}

export const leaderboardApi = {
  getLeaderboard,
  getTournaments,
  getAchievements,
}
