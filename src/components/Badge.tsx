import type { ReactNode } from 'react'

export type BadgeTone = 'primary' | 'neutral' | 'muted' | 'easy' | 'medium' | 'hard' | 'danger'

const tones: Record<BadgeTone, string> = {
  primary: 'bg-app-primary-soft text-app-primary border border-app-primary/25',
  neutral: 'bg-black/[0.04] text-app-text-secondary border border-black/10',
  muted: 'bg-black/[0.03] text-app-text-secondary/80 border border-black/[0.08]',
  easy: 'bg-badge-easy-bg text-badge-easy-text border border-badge-easy-border',
  medium: 'bg-badge-medium-bg text-badge-medium-text border border-badge-medium-border',
  hard: 'bg-badge-hard-bg text-badge-hard-text border border-badge-hard-border',
  // Reserved for danger / fraud warnings only ("Опасно", "Мошенничество")
  danger: 'bg-app-accent/10 text-app-accent-text border border-app-accent/30',
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
