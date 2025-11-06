/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        'orange-light': '#ffffd8',
        'orange-semi': '#f9ebbb',
        'orange-base': '#f4d69e',
        'orange-mid': '#eec281',
        'orange-dark': '#e9ad65',
        'orange-vivo': '#d88c2f',

        'blue-light': '#D7EFF9',
        'blue-base': '#5EC5FD',
        'blue-dark': '#009CF0',

        'red-light': '#ce5b5b',
        'red-dark': '#994949',

        'gray-dark': '#4B5563',

        'green-light': '#DCFCE7',
        'green-dark': '#279745',

        'yellow-mid': '#a7a51a',

        'white': '#FFFFFF',
        'background': '#FBF4F4',
        'shape': '#F5EAEA',

        'gray-100': '#ADADAD',
        'gray-200': '#949494',
        'gray-300': '#666666',
        'gray-400': '#3D3D3D',
        'gray-500': '#1D1D1D',

        'danger': '#DC3545',
        'success': '#28A745',
      },
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      fontSize: {
        // DM Sans - Titles
        'title-lg': ['28px', { lineHeight: '120%', fontWeight: '700' }],
        'title-md': ['24px', { lineHeight: '120%', fontWeight: '700' }],
        'title-sm': ['18px', { lineHeight: '120%', fontWeight: '700' }],

        // Poppins - Body e outros
        'subtitle': ['16px', { lineHeight: '120%', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '120%', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '120%', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '120%', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '120%', fontWeight: '500', textTransform: 'uppercase' }],
        'label-sm': ['10px', { lineHeight: '120%', fontWeight: '500', textTransform: 'uppercase' }],
        'action-md': ['16px', { lineHeight: '120%', fontWeight: '500' }],
        'action-sm': ['14px', { lineHeight: '120%', fontWeight: '500' }],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '4px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
