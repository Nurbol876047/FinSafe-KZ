import { GitBranch, Search, ShieldQuestion, TrendingDown } from 'lucide-react'
import type { GameType } from '@/types'

export const gameTypeIcon: Record<GameType, typeof ShieldQuestion> = {
  'scam-or-not': ShieldQuestion,
  detective: Search,
  dropper: GitBranch,
  pyramid: TrendingDown,
}
