/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#F3F5F9',
          surface: '#FFFFFF',
          text: '#141B2C',
          'text-secondary': '#55637A',
          accent: '#0A7A61',
          'accent-hover': '#086553',
          'accent-soft': '#45DDB5',
        },
        section: {
          games: '#214B60',
          academy: '#303D6B',
          championship: '#49354E',
          media: '#294D49',
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
        card: '0 10px 30px -15px rgba(0, 0, 0, 0.45)',
      },
      maxWidth: {
        app: '1200px',
      },
    },
  },
  plugins: [],
}
