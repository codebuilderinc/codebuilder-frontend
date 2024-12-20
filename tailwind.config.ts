import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', // Include files in src/app
    './src/components/**/*.{js,ts,jsx,tsx}', // Optionally include other directories
  ],
  theme: {
    extend: {
      colors: {
        cbBlue: {
          1: '#7efde3',
          2: '#29d3fe',
          3: '#0087a9',
          4: '#08afde',
          5: '#26b7e1',
          6: '#09afdf',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        grey: colors.gray,
        emerald: colors.emerald,
        indigo: colors.indigo,
        yellow: colors.yellow,
        green: colors.emerald,
        purple: colors.violet,
        pink: colors.fuchsia,
        teal: colors.teal,
        red: colors.red,
        blue: colors.blue,
        cyan: colors.cyan,
        orange: colors.orange,
        lime: colors.lime,
        amber: colors.amber,
        rose: colors.rose,
        stone: colors.stone,
        neutral: colors.neutral,
        slate: colors.slate,
        zinc: colors.zinc,
        sky: colors.sky,
        fuchsia: colors.fuchsia,
      },
    },
  },
  plugins: [],
}
export default config
