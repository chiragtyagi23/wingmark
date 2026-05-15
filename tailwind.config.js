/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        silver: '#CDCDCD',
        'med-gray': '#B0B0B0',
        royal: '#0E385E',
        steel: '#1C4669',
        charcoal: '#0A1A2F',
        ink: '#06121F',
        'dark-gray': '#616263',
        gold: '#F7C61B',
        brandRed: '#9A0704',
        white: '#FAFAFA',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        serif: ['Times New Roman', 'Times', 'serif'],
        times: ['Times New Roman', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
};
