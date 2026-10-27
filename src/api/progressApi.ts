import type {
  FinalTestResult,
  GameAttempt,
  LessonProgress,
  UserProfile,
  UserProgress,
} from '@/types'

import { withDelay } from './helpers'

const STORAGE_KEY = 'finsafe.progress.v1'

const DEFAULT_PROGRESS: UserProgress = {
  profile: { nickname: 'Қорғалған пайдаланушы', avatarColor: '#45DDB5' },
  completedLessons: [],
  finalTestResults: [],
  gameAttempts: [],
  unlockedAchievementIds: [],
}

function readProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROGRESS }
    const parsed = JSON.parse(raw) as Partial<UserProgress>
    return {
      profile: parsed.profile ?? DEFAULT_PROGRESS.profile,
      completedLessons: parsed.completedLessons ?? [],
      finalTestResults: parsed.finalTestResults ?? [],
      gameAttempts: parsed.gameAttempts ?? [],
      unlockedAchievementIds: parsed.unlockedAchievementIds ?? [],
    }
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

function writeProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // localStorage unavailable — progress simply won't persist this session
  }
}

async function getProgress(): Promise<UserProgress> {
  return withDelay(readProgress())
}

async function updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
  const progress = readProgress()
  progress.profile = { ...progress.profile, ...patch }
  writeProgress(progress)
  return withDelay(progress.profile)
}

async function completeLesson(courseId: string, lessonId: string): Promise<LessonProgress[]> {
  const progress = readProgress()
  const already = progress.completedLessons.some(
    (entry) => entry.courseId === courseId && entry.lessonId === lessonId,
  )
  if (!already) {
    progress.completedLessons.push({ courseId, lessonId, completedAt: new Date().toISOString() })
    writeProgress(progress)
  }
  return withDelay(progress.completedLessons)
}

async function saveFinalTestResult(courseId: string, scorePercent: number): Promise<FinalTestResult> {
  const progress = readProgress()
  const result: FinalTestResult = { courseId, scorePercent, passedAt: new Date().toISOString() }
  progress.finalTestResults = [
    ...progress.finalTestResults.filter((entry) => entry.courseId !== courseId),
    result,
  ]
  writeProgress(progress)
  return withDelay(result)
}

async function recordGameAttempt(attempt: GameAttempt): Promise<GameAttempt> {
  const progress = readProgress()
  progress.gameAttempts.push(attempt)
  writeProgress(progress)
  return withDelay(attempt)
}

async function unlockAchievements(ids: string[]): Promise<string[]> {
  const progress = readProgress()
  const next = new Set(progress.unlockedAchievementIds)
  ids.forEach((id) => next.add(id))
  progress.unlockedAchievementIds = Array.from(next)
  writeProgress(progress)
  return withDelay(progress.unlockedAchievementIds)
}

export const progressApi = {
  getProgress,
  updateProfile,
  completeLesson,
  saveFinalTestResult,
  recordGameAttempt,
  unlockAchievements,
}
