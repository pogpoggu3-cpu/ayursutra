/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette for AyurSutra
        'mint': {
          50: '#F4FBF7',
          100: '#E8F6F0',
          200: '#C6E9D7',
          300: '#A4DCBD',
          400: '#60C18A',
          500: '#1CA757',
          600: '#19964E',
          700: '#147D41',
          800: '#106334',
          900: '#0D512A'
        },
        'sage': {
          50: '#F0F4F1',
          100: '#E1E9E3',
          200: '#C4D3C7',
          300: '#A6BDAB',
          400: '#8DBAA3',
          500: '#6B9F7C',
          600: '#5A8769',
          700: '#4A6F56',
          800: '#3A5743',
          900: '#2A3F30'
        },
        'teal': {
          50: '#E8F2F0',
          100: '#D1E5E1',
          200: '#A3CBC3',
          300: '#75B1A5',
          400: '#479787',
          500: '#2E6B56',
          600: '#255B4A',
          700: '#1C4B3E',
          800: '#133B32',
          900: '#0A2B26'
        },
        'beige': {
          50: '#FAF8F4',
          100: '#F5F1E9',
          200: '#EBE3D3',
          300: '#E1D5BD',
          400: '#D4C2A9',
          500: '#C7AF95',
          600: '#B89C81',
          700: '#A9896D',
          800: '#9A7659',
          900: '#8B6345'
        },
        'charcoal': {
          DEFAULT: '#333333',
          50: '#F5F5F5',
          100: '#EBEBEB',
          200: '#D6D6D6',
          300: '#C2C2C2',
          400: '#ADADAD',
          500: '#999999',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333',
          900: '#1A1A1A'
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 15px 25px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};