/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fa9b9f',
          dark: '#f07e84',
          light: '#fce8e9',
          hover: '#fbafb3',
        },
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        overlay: 'var(--color-overlay)',
        border: 'var(--color-border)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        success: {
          DEFAULT: '#015730',
          light: '#e6efe9',
        },
        warning: {
          DEFAULT: '#ee872b',
          light: '#fdf3ea',
        },
        error: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
