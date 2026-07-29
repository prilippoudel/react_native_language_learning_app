/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./theme/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand Primary Palette
        lingua: {
          purple: '#6C4EF5',
          'deep-purple': '#5B3BF6',
          blue: '#4D8BFF',
          green: '#21C16B',
        },
        primary: {
          DEFAULT: '#6C4EF5',
          purple: '#6C4EF5',
          dark: '#5B3BF6',
          blue: '#4D8BFF',
          green: '#21C16B',
        },
        // Semantic Palette
        semantic: {
          success: '#21C16B',
          warning: '#FFC800',
          streak: '#FF8A00',
          error: '#FF4D4F',
          info: '#4D8BFF',
        },
        // Neutral Palette
        neutral: {
          'text-primary': '#0D132B',
          'text-secondary': '#6B7280',
          border: '#E5E7EB',
          surface: '#F6F7FB',
          background: '#FFFFFF',
        },
      },
      fontFamily: {
        poppins: ['Poppins_400Regular', 'sans-serif'],
        'poppins-medium': ['Poppins_500Medium', 'sans-serif'],
        'poppins-semibold': ['Poppins_600SemiBold', 'sans-serif'],
        'poppins-bold': ['Poppins_700Bold', 'sans-serif'],
      },
      fontSize: {
        h1: ['32px', { lineHeight: '38.4px', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '31.2px', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '26px', fontWeight: '600' }],
        h4: ['16px', { lineHeight: '22.4px', fontWeight: '500' }],
        'body-lg': ['16px', { lineHeight: '25.6px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22.4px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '20.8px', fontWeight: '400' }],
        caption: ['11px', { lineHeight: '15.4px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};
