import { Captions, PlayCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/Badge'
import { useLocalizedText } from '@/hooks/useLocale'
import type { MediaPost } from '@/types'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export function MediaPostDetails({ post }: { post: MediaPost }) {
  const { t } = useTranslation()
  const text = useLocalizedText()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge tone="neutral">{t(`media.filters.categories.${post.category}`)}</Badge>
        <span className="text-xs text-app-text-secondary">{dateFormatter.format(new Date(post.publishedAt))}</span>
      </div>
      {post.type === 'video' ? (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-card py-10 text-app-text"
          style={{ backgroundColor: `${post.coverColor}66` }}
        >
          <PlayCircle size={40} strokeWidth={1.5} />
          <p className="text-sm">{t('media.videoPlaceholder')}</p>
          <div className="flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs text-app-text">
            <Captions size={14} strokeWidth={1.75} />
            {t('media.subtitlesPlaceholder')}
          </div>
        </div>
      ) : null}
      <p className="text-sm leading-relaxed text-app-text-secondary">{text(post.body)}</p>
    </div>
  )
}
