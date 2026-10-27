import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'

const cardBase = 'rounded-card border border-app-card-border bg-app-card'

interface CardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div className={`${cardBase} ${className}`} style={style}>
      {children}
    </div>
  )
}

const MotionLink = motion(Link)

interface CardLinkProps extends CardProps {
  to: string
  'aria-label'?: string
}

export function CardLink({ to, children, className = '', style, ...rest }: CardLinkProps) {
  return (
    <MotionLink
      to={to}
      whileHover={{ y: -3 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className={`${cardBase} block transition-shadow duration-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </MotionLink>
  )
}
