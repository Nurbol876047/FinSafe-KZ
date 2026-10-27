import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'

const cardBase = 'rounded-card border border-black/[0.08]'

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
      whileHover={{ y: -3, boxShadow: '0 12px 28px -14px rgba(20,27,44,0.22)' }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className={`${cardBase} block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </MotionLink>
  )
}
