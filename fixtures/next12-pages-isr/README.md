# Next.js 12 Pages Router ISR Test Fixture

A comprehensive test fixture for Next.js 12 focusing on Pages Router features, including Server-Side Rendering (SSR), Static Site Generation (SSG), and Incremental Static Regeneration (ISR).

## Overview

This fixture demonstrates all major features of Next.js 12's Pages Router:

- **Server-Side Rendering (SSR)** with `getServerSideProps`
- **Static Site Generation (SSG)** with `getStaticProps`
- **Incremental Static Regeneration (ISR)** with `revalidate`
- **Dynamic Routes** with `getStaticPaths`
- **Catch-all Routes** with `[...params]`
- **API Routes** (basic, dynamic, and revalidation)
- **Custom App** and **Custom Document**
- **Custom Error Pages** (404, 500)
- **CSS Modules** and **Global Styles**
- **TypeScript** support

## Directory Structure

```
next12-pages-isr/
├── pages/
│   ├── api/
│   │   ├── hello.ts              # Basic API route
│   │   ├── revalidate.ts         # On-demand revalidation
│   │   └── users/
│   │       └── [id].ts           # Dynamic API route
│   ├── blog/
│   │   └── [slug].tsx            # Dynamic blog posts with ISR
│   ├── products/
│   │   └── [...params].tsx       # Catch-all routes
│   ├── _app.tsx                  # Custom App component
│   ├── _document.tsx             # Custom Document
│   ├── index.tsx                 # Home page (SSR)
│   ├── static.tsx                # Static page (SSG)
│   ├── isr.tsx                   # ISR page
│   ├── 404.tsx                   # Custom 404
│   └── 500.tsx                   # Custom 500
├── components/
│   ├── Layout.tsx                # Layout wrapper
│   ├── Header.tsx                # Navigation header
│   └── Footer.tsx                # Footer
├── styles/
│   ├── globals.css               # Global styles
│   └── Home.module.css           # CSS modules
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

## Features Demonstrated

### 1. Server-Side Rendering (SSR)

**File:** `pages/index.tsx`

- Uses `getServerSideProps` to fetch data on every request
- Renders fresh data on each page load
- Shows current timestamp and request ID

### 2. Static Site Generation (SSG)

**File:** `pages/static.tsx`

- Uses `getStaticProps` without revalidate
- Generated once at build time
- Ideal for content that rarely changes

### 3. Incremental Static Regeneration (ISR)

**File:** `pages/isr.tsx`

- Uses `getStaticProps` with `revalidate: 10`
- Regenerates page every 10 seconds in the background
- Combines static performance with dynamic content

### 4. Dynamic Routes

**File:** `pages/blog/[slug].tsx`

- Uses `getStaticPaths` to pre-generate routes
- Uses `getStaticProps` with `revalidate: 60`
- Supports `fallback: 'blocking'` for on-demand generation
- Pre-generates common blog posts

### 5. Catch-all Routes

**File:** `pages/products/[...params].tsx`

- Matches any number of path segments
- Useful for category hierarchies
- Example: `/products/electronics/laptops/gaming`

### 6. API Routes

#### Basic API Route

**File:** `pages/api/hello.ts`

- Simple GET endpoint
- Returns JSON response
- Custom headers

#### Dynamic API Route

**File:** `pages/api/users/[id].ts`

- Handles GET, PUT, DELETE methods
- Path parameters
- Error handling

#### Revalidation API

**File:** `pages/api/revalidate.ts`

- On-demand ISR revalidation
- Secret token authentication
- Manual cache purging

### 7. Custom Components

- **Layout**: Consistent page structure
- **Header**: Navigation with active states
- **Footer**: Site information and links

### 8. Error Handling

- **404.tsx**: Custom not found page
- **500.tsx**: Custom server error page

## Installation

```bash
cd fixtures/next12-pages-isr
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Available Routes

### Pages

- `/` - Home page with SSR
- `/static` - Static page with SSG
- `/isr` - ISR page (revalidates every 10 seconds)
- `/blog/hello-world` - Blog post (ISR, revalidates every 60 seconds)
- `/blog/nextjs-12-features` - Blog post
- `/blog/isr-explained` - Blog post
- `/products/electronics` - Catch-all route example
- `/products/electronics/laptops` - Multi-segment example
- `/404` - Custom 404 page
- `/500` - Custom 500 page

### API Routes

- `GET /api/hello` - Basic API endpoint
- `GET /api/users/123` - Get user by ID
- `PUT /api/users/123` - Update user
- `DELETE /api/users/123` - Delete user
- `POST /api/revalidate?path=/isr&secret=my-secret-token` - Revalidate page

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Available variables:

- `CUSTOM_ENV_VAR` - Custom environment variable
- `API_URL` - External API URL
- `REVALIDATION_SECRET` - Secret for on-demand revalidation

### Next.js Configuration

The `next.config.js` includes:

- SWC compiler for faster builds
- Webpack 5 (default in Next.js 12)
- Image optimization configuration
- Custom headers and redirects
- i18n configuration
- Environment variables

## TypeScript

This fixture uses TypeScript for type safety:

- Strict mode enabled
- Path aliases configured (`@/components/*`, `@/styles/*`)
- Proper types for all Next.js functions
- Type-safe API routes

## Testing ISR

### Automatic Revalidation

1. Visit `/isr`
2. Note the generated timestamp
3. Wait 10 seconds
4. Refresh the page
5. The next request will show the old page
6. Subsequent requests will show the updated page

### On-Demand Revalidation

Use the revalidation API to manually purge cache:

```bash
curl -X POST "http://localhost:3000/api/revalidate?path=/isr&secret=my-secret-token"
```

## Next.js 12 Features Used

- ✅ SWC Compiler (Rust-based, faster than Babel)
- ✅ Webpack 5 (default)
- ✅ Pages Router
- ✅ API Routes
- ✅ getServerSideProps
- ✅ getStaticProps
- ✅ getStaticPaths
- ✅ ISR with revalidate
- ✅ On-demand revalidation (12.2+)
- ✅ Dynamic imports
- ✅ Image optimization
- ✅ CSS Modules
- ✅ Custom App & Document
- ✅ Custom Error Pages
- ✅ i18n routing
- ✅ Redirects & Rewrites
- ✅ TypeScript support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

This fixture demonstrates Next.js 12 performance features:

- Static HTML generation for maximum speed
- Automatic code splitting
- Optimized image loading
- SWC compiler for faster builds
- Incremental Static Regeneration for dynamic content

## Notes

- This fixture uses Next.js 12.3.4 (latest v12)
- Next.js 13+ introduces App Router (not included here)
- All pages use TypeScript for type safety
- ISR revalidation times are intentionally short for testing
- Mock data is used for blog posts and users

## License

MIT - For testing purposes only
