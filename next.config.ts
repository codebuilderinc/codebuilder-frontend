import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // trailingSlash: true, // Ensures compatibility with GitHub Pages
  webpack: (config, { isServer }) => {
    // Modify Webpack's watchOptions
    config.watchOptions = {
      poll: 1000, // Enable polling
      aggregateTimeout: 300, // Delay before rebuilding
      ignored: /node_modules/, // Example: Exclude node_modules
    }

    return config
  },
}

export default nextConfig
