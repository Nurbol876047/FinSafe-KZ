import { Clock, ListChecks } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/Badge'
import { CardLink } from '@/components/Card'
import { useLocalizedText } from '@/hooks/useLocale'
import type { Game } from '@/types'

import { gameTypeIcon } from './gameIcons'

export function GameCard({ game }: { game: Game }) {
  const { t } = useTranslation()
  const text = useLocalizedText()
  const Icon = gameTypeIcon[game.type]

  return (
    <CardLink
      to={`/games/${game.slug}`}
      className="group flex h-full flex-col gap-4 bg-section-games/10 p-5"
      aria-label={text(game.title)}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-app-accent">
          <Icon size={22} strokeWidth={1.75} />
        </div>
        <Badge tone={game.difficulty}>{t(`common.difficulty.${game.difficulty}`)}</Badge>
      </div>
      <div className="flex-1">
        <h3 className="mb-1 text-base font-semibold text-app-text">{text(game.title)}</h3>
        <p className="line-clamp-2 text-sm text-app-text-secondary">{text(game.description)}</p>
      </div>
      <div className="flex items-center gap-4 text-xs text-app-text-secondary">
        <span className="flex items-center gap-1">
          <ListChecks size={14} strokeWidth={1.75} />
          {t('common.steps', { count: game.questionsCount })}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} strokeWidth={1.75} />
          {t('common.minutesShort', { count: game.estimatedMinutes })}
        </span>
      </div>
    </CardLink>
  )
}
