/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-cream': 'rgb(236, 233, 228)',
        'custom-blue': 'rgb(173, 194, 217)',
        'custom-gray': 'rgb(124, 125, 128)',
        'custom-black': 'rgb(0, 0, 0)',
        'custom-white': 'rgb(255, 255, 255)',
        'custom-dark-blue': 'rgb(62, 95, 138)',
        'custom-light-blue': 'rgb(157, 177, 204)',
      },
    },
  },
  plugins: [],
} 