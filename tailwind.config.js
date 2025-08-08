/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        blueish: '#4ECDC4',
        greenish: '#45B7D1',
        accent: '#FFE66D',
        bg: '#F7F7F7',
        text: '#2C3E50'
      },
      fontFamily: {
        game: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
}
