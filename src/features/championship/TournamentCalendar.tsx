import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { useLocalizedText } from '@/hooks/useLocale'
import type { Tournament, TournamentStatus } from '@/types'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

const statusTone: Record<TournamentStatus, 'accent' | 'neutral' | 'muted'> = {
  active: 'accent',
  upcoming: 'neutral',
  finished: 'muted',
}

export function TournamentCalendar({ tournaments }: { tournaments: Tournament[] }) {
  const { t } = useTranslation()
  const text = useLocalizedText()

  const sorted = [...tournaments].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((tournament) => (
        <Card key={tournament.id} className="flex flex-col gap-2 bg-black/[0.015] p-4">
          <div className="flex items-center justify-between gap-2">
            <Badge tone={statusTone[tournament.status]}>{t(`championship.status.${tournament.status}`)}</Badge>
            <span className="text-xs text-app-text-secondary">
              {dateFormatter.format(new Date(tournament.startDate))} — {dateFormatter.format(new Date(tournament.endDate))}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-app-text">{text(tournament.title)}</h3>
          <p className="text-sm text-app-text-secondary">{text(tournament.description)}</p>
        </Card>
      ))}
    </div>
  )
}
