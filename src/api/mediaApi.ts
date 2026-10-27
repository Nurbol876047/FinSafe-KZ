import { mediaPosts } from '@/mocks/media'
import type { MediaPost } from '@/types'

import { cloneValue, withDelay } from './helpers'

async function getMediaPosts(): Promise<MediaPost[]> {
  return withDelay(cloneValue(mediaPosts))
}

async function getMediaPostById(id: string): Promise<MediaPost | null> {
  const found = mediaPosts.find((post) => post.id === id) ?? null
  return withDelay(found ? cloneValue(found) : null)
}

export const mediaApi = {
  getMediaPosts,
  getMediaPostById,
}
