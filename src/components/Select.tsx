import type { SelectHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: Option[]
  label: string
}

export function Select({ options, label, className = '', ...rest }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-xs text-app-text-secondary">
      {label}
      <select
        className={`rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-2 text-sm text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-app-surface text-app-text">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
