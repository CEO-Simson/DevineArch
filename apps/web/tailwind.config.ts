import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcd9ff',
          300: '#90c2ff',
          400: '#5aa3ff',
          500: '#2a84ff',
          600: '#1168e6',
          700: '#0b52b3',
          800: '#0d458d',
          900: '#103a72'
        }
      }
    }
  },
  plugins: []
} satisfies Config
