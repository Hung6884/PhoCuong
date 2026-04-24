/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#8B1A1A',
          'red-light': '#A52A2A',
          'red-dark': '#6B0F0F',
          gold: '#C9A84C',
          'gold-light': '#D4B66A',
          cream: '#F5E6D3',
          brown: '#2C1810',
          'brown-light': '#3D2314',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
