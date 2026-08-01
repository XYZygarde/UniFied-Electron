/* eslint-disable prettier/prettier */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dm-sans': ['"DM Sans"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'dm-mono': ['"DM Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}