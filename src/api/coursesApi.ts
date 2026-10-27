import { courses } from '@/mocks/courses'
import type { Course } from '@/types'

import { cloneValue, withDelay } from './helpers'

async function getCourses(): Promise<Course[]> {
  return withDelay(cloneValue(courses))
}

async function getCourseBySlug(slug: string): Promise<Course | null> {
  const found = courses.find((course) => course.slug === slug) ?? null
  return withDelay(found ? cloneValue(found) : null)
}

export const coursesApi = {
  getCourses,
  getCourseBySlug,
}
