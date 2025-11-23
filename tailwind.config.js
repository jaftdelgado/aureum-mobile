/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },

      fontFamily: {
        geist: ['Geist'],
      },

      fontSize: {
        display: 'var(--font-display)',
        'large-title': 'var(--font-large-title)',
        title1: 'var(--font-title1)',
        title2: 'var(--font-title2)',
        title3: 'var(--font-title3)',
        headline: 'var(--font-headline)',
        body: 'var(--font-body)',
        callout: 'var(--font-callout)',
        subhead: 'var(--font-subhead)',
        footnote: 'var(--font-footnote)',
        caption1: 'var(--font-caption1)',
        caption2: 'var(--font-caption2)',
      },
    },
  },

  nativewind: {
    components: {
      SafeAreaView: {
        import: 'react-native-safe-area-context',
      },
    },
  },

  plugins: [],
};
