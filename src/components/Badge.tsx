import type { ReactNode } from 'react'

export type BadgeTone = 'accent' | 'neutral' | 'muted' | 'easy' | 'medium' | 'hard'

const tones: Record<BadgeTone, string> = {
  accent: 'bg-app-accent/10 text-app-accent border border-app-accent/25',
  neutral: 'bg-black/[0.04] text-app-text-secondary border border-black/10',
  muted: 'bg-black/[0.03] text-app-text-secondary/80 border border-black/[0.08]',
  easy: 'bg-app-accent/10 text-app-accent border border-app-accent/25',
  medium: 'bg-amber-400/15 text-amber-700 border border-amber-400/40',
  hard: 'bg-rose-500/10 text-rose-700 border border-rose-400/40',
}

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
