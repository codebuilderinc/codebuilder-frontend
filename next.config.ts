import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * FIX: The 'turbo' settings have been moved to the top-level 'turbopack' property
   * as Turbopack is now considered stable in Next.js.
   */
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },

  output: 'export',

  // Note: If you are using next/image, you may need to add an
  // unoptimized: true flag here if you are not using a custom loader.
  images: {
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  /**
   * Note: The 'webpack' configuration below is applied when you run 'next build'
   * or the standard 'next dev'. It is ignored when you run 'next dev --turbopack',
   * as Turbopack uses its own Rust-based compiler.
   */
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
