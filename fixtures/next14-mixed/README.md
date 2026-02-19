# Next.js 14 Mixed Test Fixture

A comprehensive test fixture for validating YC-OpenNext deployment on Yandex Cloud. This fixture demonstrates all major Next.js 14 features including both App Router and Pages Router patterns.

## Overview

This fixture is designed to test the complete functionality of Next.js 14 applications when deployed to Yandex Cloud using YC-OpenNext. It includes examples of all rendering strategies, routing patterns, and API implementations.

## Features Demonstrated

### App Router Features

- **Root Layout** (`app/layout.tsx`)
  - Comprehensive metadata configuration
  - SEO optimization with Open Graph and Twitter cards
  - Global CSS and styling
  - Navigation header and footer

- **Server-Side Rendering** (`app/page.tsx`)
  - Dynamic data fetching on each request
  - Server Components by default
  - Real-time timestamp and data

- **Static Generation** (`app/about/page.tsx`)
  - Pre-rendered at build time
  - No dynamic data fetching
  - Fast static HTML delivery

- **Dynamic SSR Routes** (`app/blog/[slug]/page.tsx`)
  - URL parameter handling
  - Dynamic metadata generation
  - Server-side rendering per request
  - 404 handling with notFound()

- **Incremental Static Regeneration** (`app/products/[id]/page.tsx`)
  - Time-based revalidation (60 seconds)
  - Stale-while-revalidate pattern
  - Dynamic route with ISR
  - Product catalog example

- **Client Components** (`app/dashboard/page.tsx`)
  - 'use client' directive
  - React hooks (useState, useEffect)
  - Browser APIs (localStorage, navigator)
  - Client-side data fetching
  - Interactive forms and counters

- **Server Actions** (`app/server-action/page.tsx`)
  - Form handling without API routes
  - Server-side validation
  - Progressive enhancement
  - CSRF protection

### API Routes (App Router)

- **Basic API Route** (`app/api/hello/route.ts`)
  - GET and POST handlers
  - JSON response formatting
  - Environment variable access

- **Products API** (`app/api/products/route.ts`)
  - Full CRUD operations (GET, POST, PUT, DELETE)
  - Query parameter filtering
  - Error handling
  - Request validation

- **On-Demand Revalidation** (`app/api/revalidate/route.ts`)
  - Manual cache invalidation
  - Path-based revalidation
  - Tag-based revalidation
  - Secret token validation

### Pages Router Features

- **Legacy Page** (`pages/legacy/index.tsx`)
  - getServerSideProps for SSR
  - Traditional Pages Router pattern
  - Head component for metadata
  - Compatibility demonstration

- **ISR Example** (`pages/isr-example.tsx`)
  - getStaticProps with revalidate
  - 30-second revalidation
  - Dynamic content updates
  - Static generation benefits

- **Legacy API Route** (`pages/api/legacy.ts`)
  - NextApiRequest/NextApiResponse
  - Traditional API route format
  - Full HTTP method support
  - CORS headers

### Middleware

- **Request Middleware** (`middleware.ts`)
  - Custom headers on all requests
  - Request logging
  - Cookie management
  - Device detection
  - Security headers
  - Path matching configuration

### Configuration

- **Next.js Config** (`next.config.js`)
  - Standalone output mode
  - Image optimization settings
  - Custom headers
  - Redirects and rewrites
  - Server Actions configuration
  - Compiler options

- **TypeScript Config** (`tsconfig.json`)
  - Strict type checking
  - Path aliases
  - Next.js plugin integration

### Public Assets

- `public/robots.txt` - SEO and crawler configuration
- `public/favicon.ico` - Site icon (placeholder)
- `public/images/test.jpg` - Test image for optimization (placeholder)

## Project Structure

```
next14-mixed/
├── app/                          # App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── globals.css              # Global styles
│   ├── page.tsx                 # Home page (SSR)
│   ├── about/
│   │   └── page.tsx            # Static page
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx        # Dynamic SSR blog posts
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx        # ISR product pages (60s)
│   ├── dashboard/
│   │   └── page.tsx            # Client component
│   ├── server-action/
│   │   └── page.tsx            # Server actions demo
│   └── api/
│       ├── hello/
│       │   └── route.ts        # Basic API route
│       ├── products/
│       │   └── route.ts        # Products CRUD API
│       └── revalidate/
│           └── route.ts        # On-demand revalidation
├── pages/                       # Pages Router
│   ├── legacy/
│   │   └── index.tsx           # Pages Router SSR example
│   ├── isr-example.tsx         # Pages Router ISR (30s)
│   └── api/
│       └── legacy.ts           # Pages Router API route
├── public/                      # Static assets
│   ├── robots.txt
│   ├── favicon.ico
│   └── images/
│       └── test.jpg
├── middleware.ts                # Edge middleware
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Test with YC-OpenNext
npm run test:build
```

## Testing Scenarios

### 1. Server-Side Rendering (SSR)

- Visit `/` (home page)
- Visit `/blog/first-post`
- Check that data is fresh on each request
- Verify timestamps change on every refresh

### 2. Static Generation

- Visit `/about`
- Check that page loads instantly
- Verify content is static and unchanging

### 3. Incremental Static Regeneration (ISR)

- Visit `/products/1`, `/products/2`, `/products/3`
- Note the "Last Updated" timestamp
- Refresh within 60 seconds - timestamp stays the same
- Wait 60+ seconds and refresh - new timestamp appears

### 4. Client-Side Rendering

- Visit `/dashboard`
- Interact with the counter (uses localStorage)
- Click "Fetch Products" to load data client-side
- Use the search functionality

### 5. Server Actions

- Visit `/server-action`
- Submit the "Create Todo" form
- Submit the "Feedback Form"
- Verify server-side validation

### 6. API Routes

- Visit `/api/hello` - basic GET request
- Visit `/api/products` - get all products
- Visit `/api/products?id=1` - get single product
- Visit `/api/revalidate` - see documentation
- POST to `/api/revalidate` with `{"path": "/products/1"}` to trigger revalidation

### 7. Pages Router

- Visit `/legacy` - Pages Router SSR
- Visit `/isr-example` - Pages Router ISR (30s revalidation)
- Visit `/api/legacy` - Pages Router API

### 8. Middleware

- Check response headers in browser DevTools
- Look for custom headers like `X-Middleware-Version`, `X-Request-Path`
- Verify device detection headers (`X-Device-Type`)

### 9. Image Optimization

- Check that images are served in modern formats (WebP, AVIF)
- Verify responsive image sizing

### 10. Error Handling

- Visit `/blog/nonexistent` - should show 404
- Visit `/products/999` - should show 404

## Environment Variables

```bash
# Optional: Secret for revalidation API
REVALIDATION_SECRET=your-secret-token

# Optional: Custom environment variables
NODE_ENV=production
```

## Deployment

### Using YC-OpenNext

```bash
# Build the Next.js app
npm run build

# Run YC-OpenNext to prepare for Yandex Cloud
npx yc-opennext

# Deploy to Yandex Cloud
# (Follow YC-OpenNext deployment instructions)
```

### Expected Deployment Results

- All pages should render correctly
- ISR should work with YDB for caching
- API routes should be accessible
- Middleware should add custom headers
- Static assets should be served from Object Storage
- Images should be optimized

## Testing Checklist

- [ ] Home page loads and shows fresh timestamp
- [ ] About page loads instantly (static)
- [ ] Blog posts render with correct slugs
- [ ] Products pages use ISR (60s revalidation)
- [ ] Dashboard is interactive (client component)
- [ ] Server actions handle form submissions
- [ ] Legacy pages router works
- [ ] All API routes respond correctly
- [ ] Middleware adds custom headers
- [ ] On-demand revalidation works
- [ ] 404 pages work for invalid routes
- [ ] Images are optimized
- [ ] TypeScript types are correct
- [ ] Build completes without errors

## Key Files for Testing

### Critical Paths

- `/` - Main landing page
- `/api/hello` - Basic API test
- `/api/products` - CRUD API test
- `/products/1` - ISR test
- `/dashboard` - Client component test
- `/server-action` - Server actions test

### Configuration Files

- `next.config.js` - Build and runtime config
- `middleware.ts` - Edge middleware
- `tsconfig.json` - TypeScript settings

## Known Limitations

1. Placeholder assets (favicon.ico, test.jpg) should be replaced with real files for production
2. In-memory data storage (not persistent across deployments)
3. No database integration (simulated data)
4. No authentication/authorization (demo only)

## Next.js 14 Features Coverage

### Routing

- [x] App Router
- [x] Pages Router
- [x] Dynamic routes
- [x] Route groups (not implemented - optional)
- [x] Parallel routes (not implemented - optional)
- [x] Intercepting routes (not implemented - optional)

### Rendering

- [x] Server Components
- [x] Client Components
- [x] Server-Side Rendering (SSR)
- [x] Static Site Generation (SSG)
- [x] Incremental Static Regeneration (ISR)
- [x] On-Demand Revalidation

### Data Fetching

- [x] Server Components data fetching
- [x] getServerSideProps (Pages Router)
- [x] getStaticProps (Pages Router)
- [x] Client-side fetching

### API

- [x] App Router API routes
- [x] Pages Router API routes
- [x] Server Actions
- [x] Route Handlers (GET, POST, PUT, DELETE)

### Optimization

- [x] Image Optimization
- [x] Font Optimization (not explicitly shown)
- [x] Script Optimization (not explicitly shown)

### Configuration

- [x] Metadata API
- [x] Custom headers
- [x] Redirects
- [x] Rewrites
- [x] Middleware
- [x] TypeScript

### Additional

- [x] Error handling
- [x] Not found pages
- [x] Loading states (could be enhanced)
- [x] Streaming (implicit in App Router)

## Contributing

This is a test fixture. Modifications should ensure comprehensive coverage of Next.js 14 features for YC-OpenNext validation.

## License

MIT License - This is a test fixture for development and testing purposes.
