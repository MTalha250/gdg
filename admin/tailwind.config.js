module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layout/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          25:  '#eaf3f4',
          50:  '#dbe9ea',
          100: '#c6dbdd',
          200: '#b0cdd0',
          300: '#9bc0c3',
          400: '#8ab0b2',
          500: '#8ab0b2',
          600: '#7ca0a2',
          700: '#6b8c8e',
          800: '#5a787a',
          900: '#4a6466',
          950: '#2e3d3e',
        },
      },
    },
  },
  plugins: [],
}; 