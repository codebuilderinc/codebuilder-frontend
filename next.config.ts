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
  env: {
    // Server-side only variables
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    FCM_SERVER_KEY: process.env.FCM_SERVER_KEY,

    // Public variables (exposed to client-side)
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    NEXT_PUBLIC_MATOMO_URL: process.env.NEXT_PUBLIC_MATOMO_URL,
    NEXT_PUBLIC_MATOMO_SITE_ID: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
  },
}

export default nextConfig
