/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Use the new package here
    autoprefixer: {},
  },
}

export default config
