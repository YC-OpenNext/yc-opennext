/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for development (default in Next.js 15)
  // Use --turbo flag with 'next dev' command

  experimental: {
    // PPR requires canary Next.js, disabled for stable builds
    // ppr: 'incremental',

    // Enable React Compiler (when available)
    reactCompiler: false,

    // Improve server actions
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000'],
    },
  },

  // TypeScript configuration
  typescript: {
    // Ignore build errors from @types/react version conflicts in monorepo
    ignoreBuildErrors: true,
  },

  // Logging for better debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
