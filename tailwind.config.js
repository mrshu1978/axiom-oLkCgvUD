/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'base': '#0A0A12',
        'surface': '#1A1A2E',
        'accent': '#7C3AED',
        'text-primary': '#FFFFFF',
        'text-secondary': '#9CA3AF',
        'success': '#10B981',
        'danger': '#EF4444',
        'warning': '#F59E0B',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}