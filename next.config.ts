import type { NextConfig } from 'next'

// A helper variable to easily check if we are in static export mode.
const isStaticExport = process.env.NEXT_OUTPUT_MODE === 'export'

const nextConfig: NextConfig = {
  /**
   * FIX: The 'turbo' settings have been moved to the top-level 'turbopack' property
   * as Turbopack is now considered stable in Next.js.
   */
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },

  // Conditionally set the output mode for the build.
  output: isStaticExport ? 'export' : undefined,

  // Note: If you are using next/image, you may need to add an
  // unoptimized: true flag here if you are not using a custom loader.
  // Conditionally disable image optimization only for the static export.
  images: {
    unoptimized: isStaticExport,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Enable logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Ensure proper console output in Docker containers
  experimental: {
    // This helps with console output in Docker
    forceSwcTransforms: true,
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
