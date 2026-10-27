import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { mediaApi } from '@/api/mediaApi'
import { Container } from '@/components/Container'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Modal } from '@/components/Modal'
import { SkeletonCard } from '@/components/Skeleton'
import { Tabs } from '@/components/Tabs'
import { MediaCard } from '@/features/media/MediaCard'
import { MediaPostDetails } from '@/features/media/MediaPostDetails'
import { useAsync } from '@/hooks/useAsync'
import { useLocalizedText } from '@/hooks/useLocale'
import type { MediaCategory, MediaPost } from '@/types'

const categories: MediaCategory[] = ['scams', 'banking', 'investments', 'digital-hygiene', 'news']

export default function MediaPage() {
  const { t } = useTranslation()
  const text = useLocalizedText()
  const state = useAsync(() => mediaApi.getMediaPosts(), [])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<MediaCategory | 'all'>('all')
  const [activePost, setActivePost] = useState<MediaPost | null>(null)

  const filtered = useMemo(() => {
    if (state.status !== 'success') return []
    const query = search.trim().toLowerCase()
    return state.data.filter((post) => {
      const matchesCategory = category === 'all' || post.category === category
      const matchesSearch =
        query === '' || text(post.title).toLowerCase().includes(query) || text(post.excerpt).toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [state, search, category, text])

  return (
    <>
      <Helmet>
        <title>{t('media.pageTitle')} — FINSAFE KZ</title>
      </Helmet>
      <Container className="flex flex-col gap-6 py-8">
        <div>
          <h1 className="text-2xl font-bold text-app-text">{t('media.pageTitle')}</h1>
          <p className="mt-1 text-app-text-secondary">{t('media.pageSubtitle')}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative max-w-md">
            <Search size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-secondary" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('media.searchPlaceholder')}
              className="w-full rounded-full border border-black/10 bg-black/[0.03] py-2.5 pl-10 pr-4 text-sm text-app-text placeholder:text-app-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
            />
          </div>
          <Tabs
            activeId={category}
            onChange={(id) => setCategory(id as MediaCategory | 'all')}
            tabs={[
              { id: 'all', label: t('media.filters.all') },
              ...categories.map((item) => ({ id: item, label: t(`media.filters.categories.${item}`) })),
            ]}
          />
        </div>

        {state.status === 'loading' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}
        {state.status === 'error' && <ErrorState onRetry={state.retry} />}
        {state.status === 'success' &&
          (filtered.length === 0 ? (
            <EmptyState title={t('common.empty.title')} body={t('common.empty.body')} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <MediaCard key={post.id} post={post} onOpen={setActivePost} />
              ))}
            </div>
          ))}
      </Container>

      <Modal open={activePost !== null} onClose={() => setActivePost(null)} title={activePost ? text(activePost.title) : ''}>
        {activePost ? <MediaPostDetails post={activePost} /> : null}
      </Modal>
    </>
  )
}
