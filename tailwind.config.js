/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
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
          50: '#EBF5FF',
          100: '#E1EFFE',
          200: '#C3DDFD',
          300: '#A4CAFE',
          600: '#1C64F2',
          700: '#1A56DB',
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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: {
              marginTop: '2rem',
              marginBottom: '1rem',
              color: '#111928',
            },
            h2: {
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              color: '#1F2A37',
            },
            h3: {
              marginTop: '1.25rem',
              marginBottom: '0.75rem',
              color: '#374151',
            },
            p: {
              marginTop: '0.75rem',
              marginBottom: '0.75rem',
            },
            'ul > li': {
              marginTop: '0.375rem',
              marginBottom: '0.375rem',
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              borderLeftColor: '#1C64F2',
              backgroundColor: '#F3F4F6',
              padding: '1rem',
              borderRadius: '0.375rem',
            },
            strong: {
              color: '#1C64F2',
              fontWeight: '600',
            },
            hr: {
              marginTop: '2rem',
              marginBottom: '2rem',
              borderColor: '#E5E7EB',
            },
            pre: {
              backgroundColor: '#F9FAFB',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #E5E7EB',
            },
            code: {
              color: '#1C64F2',
              backgroundColor: '#F3F4F6',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
            },
            table: {
              width: '100%',
              marginTop: '2rem',
              marginBottom: '2rem',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            },
            'thead th': {
              verticalAlign: 'bottom',
              borderBottomWidth: '2px',
              borderBottomColor: '#E5E7EB',
              padding: '0.75rem',
              backgroundColor: '#F9FAFB',
              color: '#374151',
              fontWeight: '600',
              textAlign: 'left',
            },
            'tbody td': {
              padding: '0.75rem',
              borderBottomWidth: '1px',
              borderBottomColor: '#E5E7EB',
              verticalAlign: 'top',
            },
            'tbody tr:hover': {
              backgroundColor: '#F3F4F6',
            },
            'tbody tr:nth-child(odd)': {
              backgroundColor: '#FAFAFA',
            },
            '@media (max-width: 640px)': {
              table: {
                display: 'block',
                overflowX: 'auto',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
