import { Check, CheckCircle2, Circle, CheckSquare, Square, XCircle } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ProgressBar } from '@/components/ProgressBar'
import { useLocalizedText } from '@/hooks/useLocale'
import type { Game, GameAttemptAnswer, GameStep, GameStepOption } from '@/types'

import { getMaxScore, getNextStepId, getResultTier, isAnswerCorrect, isTerminalStep } from './scoring'

type Phase = 'interactive' | 'revealed'

interface GameRunnerProps {
  game: Game
  onComplete: (score: number, maxScore: number, answers: GameAttemptAnswer[]) => void
}

function optionVisualState(option: GameStepOption, selected: string[], revealed: boolean) {
  const isSelected = selected.includes(option.id)
  if (!revealed) return isSelected ? 'selected' : 'default'
  if (isSelected && option.correct) return 'correct'
  if (isSelected && !option.correct) return 'incorrect'
  if (!isSelected && option.correct) return 'missed'
  return 'default'
}

const optionStateClasses: Record<string, string> = {
  default: 'border-black/10 bg-black/[0.02] hover:bg-black/[0.05]',
  selected: 'border-app-accent bg-app-accent/10',
  correct: 'border-emerald-500/50 bg-emerald-500/10',
  incorrect: 'border-rose-500/50 bg-rose-500/10',
  missed: 'border-emerald-500/30 bg-transparent',
}

export function GameRunner({ game, onComplete }: GameRunnerProps) {
  const { t } = useTranslation()
  const text = useLocalizedText()

  const [currentStepId, setCurrentStepId] = useState(game.startStepId)
  const [selected, setSelected] = useState<string[]>([])
  const [answers, setAnswers] = useState<GameAttemptAnswer[]>([])
  const [phase, setPhase] = useState<Phase>('interactive')
  const [validationError, setValidationError] = useState(false)
  const [finished, setFinished] = useState(false)
  const [visitedCount, setVisitedCount] = useState(1)
  const completedRef = useRef(false)

  const currentStep: GameStep = useMemo(
    () => game.steps.find((step) => step.id === currentStepId) ?? game.steps[0],
    [game, currentStepId],
  )
  const terminal = isTerminalStep(currentStep)

  useEffect(() => {
    setValidationError(false)
    if (terminal) {
      setAnswers((prev) => {
        if (prev.some((answer) => answer.stepId === currentStep.id)) return prev
        return [
          ...prev,
          { stepId: currentStep.id, optionIds: [], correct: currentStep.points > 0, pointsEarned: currentStep.points },
        ]
      })
      setPhase('revealed')
    } else {
      setSelected([])
      setPhase('interactive')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepId])

  useEffect(() => {
    if (finished && !completedRef.current) {
      completedRef.current = true
      const score = answers.reduce((sum, answer) => sum + answer.pointsEarned, 0)
      onComplete(score, getMaxScore(game), answers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  function handleToggle(optionId: string) {
    if (phase !== 'interactive') return
    setValidationError(false)
    if (currentStep.kind === 'multiselect') {
      setSelected((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]))
    } else {
      setSelected([optionId])
    }
  }

  function handleSubmit() {
    if (selected.length === 0) {
      setValidationError(true)
      return
    }
    const correct = isAnswerCorrect(currentStep, selected)
    setAnswers((prev) => [...prev, { stepId: currentStep.id, optionIds: selected, correct, pointsEarned: correct ? currentStep.points : 0 }])
    setPhase('revealed')
  }

  function handleAdvance() {
    const nextId = getNextStepId(game, currentStep, selected)
    if (nextId) {
      setVisitedCount((count) => count + 1)
      setCurrentStepId(nextId)
    } else {
      setFinished(true)
    }
  }

  function handleRestart() {
    completedRef.current = false
    setAnswers([])
    setSelected([])
    setFinished(false)
    setVisitedCount(1)
    setCurrentStepId(game.startStepId)
  }

  if (finished) {
    const score = answers.reduce((sum, answer) => sum + answer.pointsEarned, 0)
    const maxScore = getMaxScore(game)
    return <ResultScreen game={game} score={score} maxScore={maxScore} onRestart={handleRestart} />
  }

  const totalForProgress = game.type === 'dropper' ? Math.max(visitedCount, game.questionsCount) : game.steps.length
  const chosenOption = phase === 'revealed' ? currentStep.options.find((option) => selected.includes(option.id)) : undefined
  const nextExists = phase === 'revealed' && getNextStepId(game, currentStep, selected) !== null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-app-text-secondary">
          {t('games.runner.step', { current: Math.min(visitedCount, totalForProgress), total: totalForProgress })}
        </span>
        <Badge tone={game.difficulty}>{t(`common.difficulty.${game.difficulty}`)}</Badge>
      </div>
      <ProgressBar value={Math.min(visitedCount, totalForProgress)} max={totalForProgress} color={game.accentColor} />

      <Card className="flex flex-col gap-4 bg-black/[0.015] p-5 sm:p-6">
        {currentStep.context ? (
          <div className="flex flex-wrap items-center gap-2 text-xs text-app-text-secondary">
            {currentStep.context.channel ? <Badge tone="neutral">{text(currentStep.context.channel)}</Badge> : null}
            {currentStep.context.sender ? <span>{text(currentStep.context.sender)}</span> : null}
          </div>
        ) : null}

        {text(currentStep.scenario) ? (
          <p className="rounded-card border border-black/[0.06] bg-black/[0.03] p-4 text-sm leading-relaxed whitespace-pre-line text-app-text">
            {text(currentStep.scenario)}
          </p>
        ) : null}

        {!terminal && (
          <>
            <p className="font-medium text-app-text">{text(currentStep.question)}</p>
            <div className="flex flex-col gap-2.5">
              {currentStep.options.map((option) => {
                const state = optionVisualState(option, selected, phase === 'revealed')
                const Icon =
                  currentStep.kind === 'multiselect'
                    ? selected.includes(option.id)
                      ? CheckSquare
                      : Square
                    : selected.includes(option.id)
                      ? CheckCircle2
                      : Circle
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={phase === 'revealed'}
                    onClick={() => handleToggle(option.id)}
                    className={`flex items-center gap-3 rounded-card border px-4 py-3 text-left text-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent disabled:cursor-default ${optionStateClasses[state]}`}
                  >
                    <Icon size={18} strokeWidth={1.75} className="shrink-0 text-app-text-secondary" />
                    <span className="flex-1 text-app-text">{text(option.text)}</span>
                    {state === 'correct' && <Check size={16} className="shrink-0 text-emerald-600" />}
                    {state === 'incorrect' && <XCircle size={16} className="shrink-0 text-rose-600" />}
                  </button>
                )
              })}
            </div>
            {validationError && <p className="text-sm text-rose-600">{t('games.runner.selectAtLeastOne')}</p>}
          </>
        )}

        {phase === 'revealed' && (
          <div className="rounded-card border border-app-accent/20 bg-app-accent/[0.06] p-4">
            <p className="mb-1.5 text-sm font-semibold text-app-accent">{t('games.runner.explanationTitle')}</p>
            {chosenOption?.consequence ? (
              <p className="mb-2 text-sm text-app-text">{text(chosenOption.consequence)}</p>
            ) : null}
            <p className="text-sm leading-relaxed text-app-text-secondary">{text(currentStep.explanation)}</p>
          </div>
        )}

        <div className="flex justify-end">
          {phase === 'interactive' ? (
            <Button onClick={handleSubmit}>{t('games.runner.submit')}</Button>
          ) : (
            <Button onClick={handleAdvance}>
              {nextExists ? t('games.runner.nextStep') : t('games.runner.finish')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

function ResultScreen({
  game,
  score,
  maxScore,
  onRestart,
}: {
  game: Game
  score: number
  maxScore: number
  onRestart: () => void
}) {
  const { t } = useTranslation()
  const text = useLocalizedText()
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')
  const tier = getResultTier(score, maxScore)
  const tierKey = tier === 'good' ? 'resultGood' : tier === 'medium' ? 'resultMedium' : 'resultLow'

  async function handleShare() {
    const shareText = t('games.runner.shareText', { title: text(game.title), score, max: maxScore })
    const shareUrl = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: text(game.title), text: shareText, url: shareUrl })
        return
      }
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch {
      // user cancelled share / clipboard unavailable — no action needed
    }
  }

  return (
    <Card className="flex flex-col items-center gap-4 bg-black/[0.015] p-8 text-center">
      <h2 className="text-xl font-bold text-app-text">{t('games.runner.resultTitle')}</h2>
      <div>
        <p className="text-sm text-app-text-secondary">{t('games.runner.yourScore')}</p>
        <p className="text-4xl font-bold text-app-accent">
          {score} / {maxScore}
        </p>
      </div>
      <p className="max-w-sm text-sm text-app-text-secondary">{t(`games.runner.${tierKey}`)}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" onClick={onRestart}>
          {t('games.runner.playAgain')}
        </Button>
        <Button variant="secondary" onClick={handleShare}>
          {shareStatus === 'copied' ? t('games.runner.shareCopied') : t('games.runner.share')}
        </Button>
      </div>
      <Link to="/games" className="mt-2 text-sm font-medium text-app-text-secondary hover:text-app-text hover:underline">
        {t('games.runner.backToGames')}
      </Link>
    </Card>
  )
}
