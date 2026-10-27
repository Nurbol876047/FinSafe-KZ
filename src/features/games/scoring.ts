import type { Game, GameStep } from '@/types'

export function isTerminalStep(step: GameStep): boolean {
  return step.options.length === 0
}

export function getMaxScore(game: Game): number {
  if (game.type === 'dropper') {
    const terminals = game.steps.filter(isTerminalStep)
    return terminals.reduce((max, step) => Math.max(max, step.points), 0)
  }
  return game.steps.reduce((sum, step) => sum + step.points, 0)
}

export function isAnswerCorrect(step: GameStep, selectedOptionIds: string[]): boolean {
  const correctIds = step.options.filter((option) => option.correct).map((option) => option.id)
  if (step.kind === 'multiselect') {
    if (selectedOptionIds.length !== correctIds.length) return false
    const selectedSet = new Set(selectedOptionIds)
    return correctIds.every((id) => selectedSet.has(id))
  }
  return selectedOptionIds.length === 1 && correctIds.includes(selectedOptionIds[0])
}

export function getNextStepId(game: Game, step: GameStep, selectedOptionIds: string[]): string | null {
  if (step.kind === 'branch') {
    const chosen = step.options.find((option) => option.id === selectedOptionIds[0])
    return chosen?.nextStepId ?? null
  }
  const index = game.steps.findIndex((candidate) => candidate.id === step.id)
  return game.steps[index + 1]?.id ?? null
}

export function getResultTier(score: number, maxScore: number): 'good' | 'medium' | 'low' {
  if (maxScore <= 0) return 'low'
  const ratio = score / maxScore
  if (ratio >= 0.8) return 'good'
  if (ratio >= 0.5) return 'medium'
  return 'low'
}
