import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  body?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, body, icon, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-card border border-black/[0.08] bg-black/[0.02] px-6 py-12 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/[0.05] text-app-text-secondary">
        {icon ?? <Inbox size={22} strokeWidth={1.75} />}
      </div>
      <p className="font-medium text-app-text">{title}</p>
      {body ? <p className="max-w-sm text-sm text-app-text-secondary">{body}</p> : null}
      {action}
    </div>
  )
}
