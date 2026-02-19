/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC compiler for minification (Next.js 12 feature)

  // Image optimization configuration
  images: {
    domains: ['example.com', 'images.unsplash.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  // Environment variables
  env: {
    CUSTOM_ENV_VAR: process.env.CUSTOM_ENV_VAR || 'default-value',
    API_URL: process.env.API_URL || 'http://localhost:3000',
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Custom-Header',
            value: 'my-custom-header-value',
          },
          {
            key: 'X-API-Version',
            value: 'v1',
          },
        ],
      },
    ];
  },

  // Redirects configuration
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/documentation',
        permanent: false,
      },
    ];
  },

  // Rewrites configuration
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },

  // i18n configuration (Next.js 12 feature)
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  // Compression
  compress: true,

  // Powered by header
  poweredByHeader: false,

  // Trailing slash
  trailingSlash: false,

  // Generate ETag
  generateEtags: true,

  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig;
