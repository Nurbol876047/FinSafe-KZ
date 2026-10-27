/** Reads a "R G B" CSS variable so Tailwind's opacity modifiers (e.g. bg-app-primary/10) keep working. */
function withOpacity(variable) {
  return ({ opacityValue }) =>
    opacityValue === undefined ? `rgb(var(${variable}))` : `rgb(var(${variable}) / ${opacityValue})`
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: withOpacity('--color-background'),
          surface: withOpacity('--color-surface'),
          card: withOpacity('--color-card'),
          'card-border': withOpacity('--color-card-border'),
          text: withOpacity('--color-text'),
          'text-secondary': withOpacity('--color-text-secondary'),
          primary: withOpacity('--color-primary'),
          'primary-hover': withOpacity('--color-primary-hover'),
          'primary-soft': withOpacity('--color-primary-soft'),
          navy: withOpacity('--color-navy'),
          'navy-subtle': withOpacity('--color-navy-subtle'),
          link: withOpacity('--color-link'),
          // Reserved for danger / fraud warnings only ("Опасно", "Мошенничество")
          accent: withOpacity('--color-accent'),
          'accent-text': withOpacity('--color-accent-text'),
        },
        badge: {
          'easy-bg': withOpacity('--color-badge-easy-bg'),
          'easy-text': withOpacity('--color-badge-easy-text'),
          'easy-border': withOpacity('--color-badge-easy-border'),
          'medium-bg': withOpacity('--color-badge-medium-bg'),
          'medium-text': withOpacity('--color-badge-medium-text'),
          'medium-border': withOpacity('--color-badge-medium-border'),
          'hard-bg': withOpacity('--color-badge-hard-bg'),
          'hard-text': withOpacity('--color-badge-hard-text'),
          'hard-border': withOpacity('--color-badge-hard-border'),
        },
      },
      fontFamily: {
        sans: ['Ubuntu', '"Noto Sans"', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        container: '24px',
        card: '16px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      boxShadow: {
        'card-hover': '0 12px 28px -16px rgba(17, 24, 39, 0.18)',
      },
      maxWidth: {
        app: '1200px',
      },
    },
  },
  plugins: [],
}
