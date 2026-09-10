import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        tangerine: { DEFAULT: '#FF7A1A', dark: '#E8630A', light: '#FFA34D' },
        lime: { DEFAULT: '#8BC53F', dark: '#6FA82B', light: '#B6E06B' },
        watermelon: { DEFAULT: '#FF3D77', dark: '#E01F5C', light: '#FF7DA6' },
        sunshine: { DEFAULT: '#FFD93D', dark: '#F2C300', light: '#FFE97A' },
        cream: '#FFF8EC'
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        body: ['"Poppins"', 'sans-serif']
      },
      borderRadius: {
        '4xl': '32px'
      },
      borderWidth: {
        '3': '3px'
      }
    }
  }
};