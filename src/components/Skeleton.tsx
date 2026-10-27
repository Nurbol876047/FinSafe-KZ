interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-card bg-black/[0.06] ${className}`} />
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`rounded-card border border-black/[0.08] bg-black/[0.02] p-5 ${className}`}>
      <Skeleton className="mb-4 h-10 w-10 rounded-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="mt-1 h-3 w-5/6" />
    </div>
  )
}
