import type { ReactNode } from 'react'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 sm:px-8 ${className}`}>{children}</div>
}
