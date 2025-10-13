/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7B54',
        secondary: '#FFD56B',
        background: '#FDFBF9',
        card: '#FFFFFF',
        text: '#333333',
        textSecondary: '#666666',
        success: '#4CAF50',
        error: '#E53935',
        hover: '#E86C44',
        navbar: '#2E2E2E',
        disabled: '#FFC1A6',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
