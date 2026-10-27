import { useTranslation } from 'react-i18next'

import type { LeaderboardEntry } from '@/types'

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  const { t } = useTranslation()

  return (
    <div className="overflow-x-auto rounded-card border border-black/[0.08]">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead>
          <tr className="border-b border-black/[0.08] text-xs text-app-text-secondary">
            <th className="px-4 py-3 font-medium">{t('championship.table.rank')}</th>
            <th className="px-4 py-3 font-medium">{t('championship.table.name')}</th>
            <th className="px-4 py-3 text-right font-medium">{t('championship.table.score')}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-black/[0.05] last:border-b-0">
              <td className="px-4 py-3 text-app-text-secondary">{entry.rank}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: entry.avatarColor }}
                  >
                    {entry.name.charAt(0)}
                  </span>
                  <span className="text-app-text">{entry.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-app-accent">{entry.score.toLocaleString('ru-RU')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
