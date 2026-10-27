import { Check, CheckCircle2, Circle, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/Button'
import { useLocalizedText } from '@/hooks/useLocale'
import type { Question } from '@/types'

interface LessonQuestionProps {
  question: Question
  answered: boolean
  onAnswer: () => void
}

export function LessonQuestion({ question, answered, onAnswer }: LessonQuestionProps) {
  const { t } = useTranslation()
  const text = useLocalizedText()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [validationError, setValidationError] = useState(false)

  const revealed = answered

  function handleSelect(optionId: string) {
    if (revealed) return
    setValidationError(false)
    setSelectedId(optionId)
  }

  function handleSubmit() {
    if (!selectedId) {
      setValidationError(true)
      return
    }
    onAnswer()
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-app-text">{text(question.prompt)}</p>
      <div className="flex flex-col gap-2.5">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id
          let state: 'default' | 'selected' | 'correct' | 'incorrect' | 'missed' = 'default'
          if (!revealed) {
            state = isSelected ? 'selected' : 'default'
          } else if (isSelected && option.isCorrect) {
            state = 'correct'
          } else if (isSelected && !option.isCorrect) {
            state = 'incorrect'
          } else if (!isSelected && option.isCorrect) {
            state = 'missed'
          }
          const stateClasses: Record<typeof state, string> = {
            default: 'border-black/10 bg-black/[0.02] hover:bg-black/[0.05]',
            selected: 'border-app-accent bg-app-accent/10',
            correct: 'border-emerald-500/50 bg-emerald-500/10',
            incorrect: 'border-rose-500/50 bg-rose-500/10',
            missed: 'border-emerald-500/30 bg-transparent',
          }
          const Icon = isSelected ? CheckCircle2 : Circle
          return (
            <button
              key={option.id}
              type="button"
              disabled={revealed}
              onClick={() => handleSelect(option.id)}
              className={`flex items-center gap-3 rounded-card border px-4 py-3 text-left text-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent disabled:cursor-default ${stateClasses[state]}`}
            >
              <Icon size={18} strokeWidth={1.75} className="shrink-0 text-app-text-secondary" />
              <span className="flex-1 text-app-text">{text(option.text)}</span>
              {state === 'correct' && <Check size={16} className="shrink-0 text-emerald-600" />}
              {state === 'incorrect' && <XCircle size={16} className="shrink-0 text-rose-600" />}
            </button>
          )
        })}
      </div>
      {validationError && <p className="text-sm text-rose-600">{t('academy.course.selectAnOption')}</p>}

      {revealed ? (
        <div className="rounded-card border border-app-accent/20 bg-app-accent/[0.06] p-4">
          <p className="text-sm leading-relaxed text-app-text-secondary">{text(question.explanation)}</p>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>{t('academy.course.submitAnswer')}</Button>
        </div>
      )}
    </div>
  )
}
