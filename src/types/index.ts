export type Locale = 'ru' | 'kk'

export interface LocalizedText {
  ru: string
  kk: string
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export type SectionKey = 'games' | 'academy' | 'championship' | 'media'

// ---------- Questions (shared by lessons, final tests and games) ----------

export interface QuestionOption {
  id: string
  text: LocalizedText
  isCorrect: boolean
}

export interface Question {
  id: string
  prompt: LocalizedText
  options: QuestionOption[]
  explanation: LocalizedText
  multiSelect?: boolean
}

// ---------- Academy ----------

export type CourseAudience = 'school' | 'student' | 'adult' | 'senior'

export type CourseTopic =
  | 'phishing'
  | 'credit'
  | 'investment'
  | 'cards'
  | 'social-engineering'
  | 'digital-hygiene'

export type CourseStatus = 'available' | 'coming-soon'

export interface Lesson {
  id: string
  courseId: string
  order: number
  title: LocalizedText
  goal: LocalizedText
  explanation: LocalizedText
  material: LocalizedText
  practicalExample: LocalizedText
  interactiveQuestion: Question
  conclusion: LocalizedText
}

export interface Course {
  id: string
  slug: string
  title: LocalizedText
  description: LocalizedText
  audience: CourseAudience[]
  topics: CourseTopic[]
  difficulty: Difficulty
  status: CourseStatus
  durationMinutes: number
  lessons: Lesson[]
  finalTest: Question[]
}

// ---------- Games ----------

export type GameType = 'scam-or-not' | 'detective' | 'dropper' | 'pyramid'

export interface GameStepOption {
  id: string
  text: LocalizedText
  /** true for the option(s) considered correct/safe */
  correct: boolean
  /** branch target step id, used by the dropper (branching story) game */
  nextStepId?: string
  /** branch-specific consequence shown instead of / in addition to the step explanation */
  consequence?: LocalizedText
}

export interface GameStepContext {
  sender?: LocalizedText
  channel?: LocalizedText
}

export interface GameStep {
  id: string
  kind: 'choice' | 'multiselect' | 'branch'
  scenario: LocalizedText
  context?: GameStepContext
  question: LocalizedText
  options: GameStepOption[]
  explanation: LocalizedText
  points: number
}

export interface Game {
  id: string
  slug: string
  type: GameType
  title: LocalizedText
  description: LocalizedText
  difficulty: Difficulty
  estimatedMinutes: number
  questionsCount: number
  accentColor: string
  startStepId: string
  steps: GameStep[]
}

export interface GameAttemptAnswer {
  stepId: string
  optionIds: string[]
  correct: boolean
  pointsEarned: number
}

export interface GameAttempt {
  id: string
  gameId: string
  score: number
  maxScore: number
  completedAt: string
  answers: GameAttemptAnswer[]
}

// ---------- Championship ----------

export type LeaderboardScope = 'week' | 'month' | 'season' | 'teams' | 'institutions'

export interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatarColor: string
  score: number
  institution?: string
  team?: string
}

export type TournamentStatus = 'upcoming' | 'active' | 'finished'

export interface Tournament {
  id: string
  title: LocalizedText
  description: LocalizedText
  startDate: string
  endDate: string
  status: TournamentStatus
}

export interface Achievement {
  id: string
  title: LocalizedText
  description: LocalizedText
  icon: string
}

// ---------- Media ----------

export type MediaCategory = 'scams' | 'banking' | 'investments' | 'digital-hygiene' | 'news'

export interface MediaPost {
  id: string
  title: LocalizedText
  excerpt: LocalizedText
  body: LocalizedText
  category: MediaCategory
  coverColor: string
  publishedAt: string
  type: 'article' | 'video'
  durationMinutes?: number
}

// ---------- Progress (persisted to localStorage) ----------

export interface LessonProgress {
  courseId: string
  lessonId: string
  completedAt: string
}

export interface FinalTestResult {
  courseId: string
  scorePercent: number
  passedAt: string
}

export interface UserProfile {
  nickname: string
  avatarColor: string
}

export interface UserProgress {
  profile: UserProfile
  completedLessons: LessonProgress[]
  finalTestResults: FinalTestResult[]
  gameAttempts: GameAttempt[]
  unlockedAchievementIds: string[]
}

// ---------- Generic async wrapper ----------

export interface ApiError {
  message: string
}
