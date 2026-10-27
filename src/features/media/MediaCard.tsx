import { Newspaper, PlayCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import { useLocalizedText } from '@/hooks/useLocale'
import type { MediaPost } from '@/types'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export function MediaCard({ post, onOpen }: { post: MediaPost; onOpen: (post: MediaPost) => void }) {
  const { t } = useTranslation()
  const text = useLocalizedText()

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden">
      <div
        className="flex h-28 items-center justify-center"
        style={{ backgroundColor: `${post.coverColor}66` }}
        aria-hidden
      >
        {post.type === 'video' ? (
          <PlayCircle size={32} strokeWidth={1.5} className="text-app-text" />
        ) : (
          <Newspaper size={28} strokeWidth={1.5} className="text-app-text" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge tone={post.category === 'scams' ? 'danger' : 'neutral'}>
            {t(`media.filters.categories.${post.category}`)}
          </Badge>
          <span className="text-xs text-app-text-secondary">{dateFormatter.format(new Date(post.publishedAt))}</span>
        </div>
        <h3 className="text-base font-semibold text-app-text">{text(post.title)}</h3>
        <p className="line-clamp-3 flex-1 text-sm text-app-text-secondary">{text(post.excerpt)}</p>
        <button
          type="button"
          onClick={() => onOpen(post)}
          className="self-start rounded-full bg-black/[0.05] px-4 py-2 text-xs font-medium text-app-text transition duration-200 hover:bg-black/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary"
        >
          {t('media.readMore')}
        </button>
      </div>
    </Card>
  )
}
