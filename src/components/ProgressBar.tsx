interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  className?: string
  label?: string
}

export function ProgressBar({ value, max = 100, color = 'rgb(var(--color-link))', className = '', label }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={className}>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-black/[0.08]"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
