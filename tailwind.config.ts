import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Cairo"', '"Tajawal"', 'system-ui', 'sans-serif'],
        display: ['"Alexandria"', '"Tajawal"', '"Cairo"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
