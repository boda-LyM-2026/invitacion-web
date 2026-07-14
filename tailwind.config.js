/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          soft: 'var(--color-primary-soft)',
        },
        neutral: {
          champagne: 'var(--color-neutral-champagne)',
          alabaster: 'var(--color-neutral-alabaster)',
          dark: 'var(--color-neutral-dark)',
          white: 'var(--color-neutral-white)',
        },
        status: {
          success: 'var(--color-status-success)',
          error: 'var(--color-status-error)',
          pending: 'var(--color-status-pending)',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)'],
        sans: ['var(--font-sans)'],
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(44, 62, 45, 0.08)',
        'wax': '0 4px 10px rgba(97, 110, 77, 0.3)',
      }
    },
  },
  plugins: [],
}