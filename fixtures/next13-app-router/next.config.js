/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is stable in 13.5.6, but including for clarity
  experimental: {
    // App directory was experimental in early Next.js 13
    // In 13.4+, it became stable but keeping this for v13 compatibility
  },

  // Font optimization (built-in with App Router)
  optimizeFonts: true,

  // Image optimization
  images: {
    domains: ['example.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Enable strict mode for better development experience
  reactStrictMode: true,

  // SWC minification (default in Next.js 13)
  swcMinify: true,
}

module.exports = nextConfig
