/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rgukt: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d8eb',
          300: '#94bbdc',
          400: '#5f97c8',
          500: '#3a79b2',
          600: '#2a5e93',
          700: '#234b76',
          800: '#1e3f62',
          900: '#1d3652',
          950: '#132336'
        }
      }
    },
  },
  plugins: [],
}
