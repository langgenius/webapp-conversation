/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    typography: require('./typography'),
    extend: {
      colors: {
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        primary: {
          50: '#F5F3FF',
          100: '#EDE9FF',
          200: '#E4DFFF',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        accent: {
          purple: '#E4DFFF',
          mint: '#E1FFF5',
        },
        blue: {
          50: '#EFF6FF',
          500: '#3B82F6',
        },
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          800: '#166534',
        },
        yellow: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          800: '#854D0E',
        },
        purple: {
          50: '#FAF5FF',
        },
        indigo: {
          25: '#F5F8FF',
          100: '#E0EAFF',
          600: '#4F46E5',
        },
        'whitech-green': '#23FFB5',
      },
      screens: {
        mobile: '100px',
        // => @media (min-width: 100px) { ... }
        tablet: '640px', // 391
        // => @media (min-width: 600px) { ... }
        pc: '769px',
        // => @media (min-width: 769px) { ... }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
