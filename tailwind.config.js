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
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          700: '#374151',
          800: '#1F2A37',
          900: '#111928',
        },
        primary: {
          50: '#E2F2F0',
          100: '#C5E5E2',
          200: '#A7D8D3',
          300: '#8ACBC5',
          400: '#6EC0B6',
          500: '#51B5A8',
          600: '#34AA99',
          700: '#0B4E45',
          800: '#083B34',
          900: '#062823',
        },
        secondary: {
          50: '#F9F8F4',
          100: '#F2EFE8',
          200: '#EBE5DA',
          300: '#E4DCCC',
          400: '#DED2BD',
          500: '#D7C9AE',
          600: '#D0BFA0',
          700: '#B9A779',
          800: '#8F825C',
          900: '#655D40',
        },
        blue: {
          500: '#E1EFFE',
        },
        green: {
          50: '#F3FAF7',
          100: '#DEF7EC',
          800: '#03543F',

        },
        yellow: {
          100: '#FDF6B2',
          800: '#723B13',
        },
        purple: {
          50: '#F6F5FF',
        },
        indigo: {
          25: '#F5F8FF',
          100: '#E0EAFF',
          600: '#444CE7',
        },
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
