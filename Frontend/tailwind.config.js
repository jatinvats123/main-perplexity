/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.5px',
        tight: '-0.3px',
      },
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5', letterSpacing: '-0.2px' }],
        sm: ['14px', { lineHeight: '1.5', letterSpacing: '-0.2px' }],
        base: ['16px', { lineHeight: '1.6', letterSpacing: '-0.3px' }],
        lg: ['18px', { lineHeight: '1.6', letterSpacing: '-0.3px' }],
        xl: ['20px', { lineHeight: '1.5', letterSpacing: '-0.4px' }],
        '2xl': ['24px', { lineHeight: '1.4', letterSpacing: '-0.5px' }],
        '3xl': ['30px', { lineHeight: '1.3', letterSpacing: '-0.6px' }],
        '4xl': ['36px', { lineHeight: '1.3', letterSpacing: '-0.7px' }],
        '5xl': ['48px', { lineHeight: '1.2', letterSpacing: '-0.8px' }],
        '6xl': ['60px', { lineHeight: '1.2', letterSpacing: '-0.9px' }],
        '7xl': ['72px', { lineHeight: '1.1', letterSpacing: '-1px' }],
      },
    },
  },
  plugins: [],
}
