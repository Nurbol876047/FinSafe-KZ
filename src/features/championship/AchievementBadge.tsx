import { Lock } from 'lucide-react'

import { Card } from '@/components/Card'
import { useLocalizedText } from '@/hooks/useLocale'
import type { Achievement } from '@/types'

import { achievementIconMap } from './achievementIcons'

export function AchievementBadge({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
  const text = useLocalizedText()
  const Icon = achievementIconMap[achievement.icon] ?? Lock

  return (
    <Card className={`flex flex-col items-center gap-2 bg-black/[0.015] p-4 text-center ${unlocked ? '' : 'opacity-50'}`}>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${unlocked ? 'bg-app-accent/10 text-app-accent' : 'bg-black/[0.05] text-app-text-secondary'}`}
      >
        {unlocked ? <Icon size={22} strokeWidth={1.75} /> : <Lock size={20} strokeWidth={1.75} />}
      </div>
      <p className="text-sm font-semibold text-app-text">{text(achievement.title)}</p>
      <p className="text-xs text-app-text-secondary">{text(achievement.description)}</p>
    </Card>
  )
}
