import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'heroPrimary' | 'heroOutline'
export type ButtonSize = 'md' | 'sm'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-app-primary text-white hover:bg-app-primary-hover focus-visible:ring-app-primary focus-visible:ring-offset-app-surface',
  secondary:
    'bg-black/[0.04] text-app-text border border-black/10 hover:bg-black/[0.07] focus-visible:ring-app-primary focus-visible:ring-offset-app-surface',
  ghost:
    'bg-transparent text-app-text-secondary hover:text-app-text hover:bg-black/[0.05] focus-visible:ring-app-primary focus-visible:ring-offset-app-surface',
  // On the navy hero only — solid white pill with primary-colored text.
  heroPrimary: 'bg-white text-app-primary hover:bg-white/90 focus-visible:ring-white focus-visible:ring-offset-app-navy',
  // On the navy hero only — white outline, transparent fill.
  heroOutline:
    'bg-transparent text-white border border-white/80 hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-app-navy',
}

const sizes: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-sm',
  sm: 'px-4 py-2 text-xs',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return `${base} ${variants[variant]} ${sizes[size]}`
}
