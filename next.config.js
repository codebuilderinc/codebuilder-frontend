// next.config.js
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  basePath: '/codebuilder-frontend', // Replace with your GitHub repository name
  trailingSlash: true, // Ensures compatibility with GitHub Pages
}
