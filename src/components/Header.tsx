import { GraduationCap, Joystick, Newspaper, ShieldCheck, Trophy, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { LanguageSwitch } from './LanguageSwitch'

const navItems = [
  { to: '/games', icon: Joystick, labelKey: 'nav.games' },
  { to: '/academy', icon: GraduationCap, labelKey: 'nav.academy' },
  { to: '/championship', icon: Trophy, labelKey: 'nav.championship' },
  { to: '/media', icon: Newspaper, labelKey: 'nav.media' },
  { to: '/profile', icon: User, labelKey: 'nav.profile' },
] as const

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="flex flex-col gap-4 bg-app-navy px-4 pt-5 pb-3 sm:px-8 sm:pt-7">
      <div className="flex items-center justify-between gap-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-app-navy"
        >
          <ShieldCheck className="text-white" size={28} strokeWidth={1.75} />
          <span className="text-lg font-bold tracking-tight text-white">{t('app.name')}</span>
        </NavLink>
        <LanguageSwitch />
      </div>
      <nav aria-label={t('nav.home')} className="-mx-1 flex gap-1 overflow-x-auto pb-1">
        {navItems.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-app-navy ${
                isActive
                  ? 'border-app-link text-white'
                  : 'border-transparent text-white/70 hover:text-white'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.75} />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
