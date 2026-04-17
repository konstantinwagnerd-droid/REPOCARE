/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F766E',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        accent: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },
        danger: '#DC2626',
        success: '#16A34A',
        warning: '#D97706',
      },
      fontFamily: {
        sans: ['Geist', 'System'],
        mono: ['GeistMono', 'Menlo'],
      },
      borderRadius: {
        card: '14px',
        button: '10px',
      },
    },
  },
  plugins: [],
};
