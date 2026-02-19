# Quick Start Guide

Get up and running with this Next.js 12 Pages Router fixture in minutes.

## Prerequisites

- Node.js 14.6.0 or higher
- npm, yarn, or pnpm

## Installation

```bash
# Navigate to the fixture directory
cd fixtures/next12-pages-isr

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Quick Tour

### 1. Home Page (SSR)

Visit: http://localhost:3000

- Server-side rendered on every request
- Shows current timestamp
- Demonstrates `getServerSideProps`

### 2. Static Page (SSG)

Visit: http://localhost:3000/static

- Generated once at build time
- Timestamp stays the same until rebuild
- Demonstrates `getStaticProps`

### 3. ISR Page

Visit: http://localhost:3000/isr

- Regenerates every 10 seconds
- Combines static + dynamic
- Demonstrates `getStaticProps` with `revalidate`

**Test ISR:**

1. Note the timestamp
2. Wait 11 seconds
3. Refresh twice to see new data

### 4. Blog Posts (Dynamic Routes)

Visit: http://localhost:3000/blog/hello-world

- Pre-generated at build time
- ISR with 60-second revalidation
- Demonstrates `getStaticPaths` + `getStaticProps`

**Available posts:**

- `/blog/hello-world`
- `/blog/nextjs-12-features`
- `/blog/isr-explained`

### 5. Catch-all Routes

Visit: http://localhost:3000/products/electronics/laptops

- Matches any number of path segments
- Shows path breakdown
- Demonstrates `[...params]` routing

**Try these:**

- `/products/electronics`
- `/products/electronics/laptops/gaming`
- `/products/clothing/shoes/running`

### 6. API Routes

#### Basic API

```bash
curl http://localhost:3000/api/hello
```

#### User API

```bash
# Get user
curl http://localhost:3000/api/users/123

# Update user
curl -X PUT http://localhost:3000/api/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name"}'
```

#### Revalidation API

```bash
curl -X POST "http://localhost:3000/api/revalidate?path=/isr&secret=my-secret-token"
```

### 7. Error Pages

**404 Page:**
Visit: http://localhost:3000/nonexistent

**500 Page:**
(Requires triggering a server error)

## File Structure

```
next12-pages-isr/
├── pages/                    # Page routes
│   ├── api/                  # API routes
│   │   ├── hello.ts          # Basic API
│   │   ├── revalidate.ts     # ISR revalidation
│   │   └── users/[id].ts     # Dynamic API route
│   ├── blog/[slug].tsx       # Dynamic blog routes
│   ├── products/[...params].tsx  # Catch-all routes
│   ├── index.tsx             # Home (SSR)
│   ├── static.tsx            # Static (SSG)
│   ├── isr.tsx               # ISR page
│   ├── 404.tsx               # Custom 404
│   └── 500.tsx               # Custom 500
├── components/               # React components
│   ├── Layout.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── styles/                   # CSS files
│   ├── globals.css
│   └── Home.module.css
├── public/                   # Static assets
├── next.config.js            # Next.js config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Lint code
npm run type-check   # Check TypeScript types

# Debugging
rm -rf .next         # Clear build cache
npm ci               # Clean install
```

## Testing Features

### Test SSR

1. Visit http://localhost:3000
2. Refresh multiple times
3. Notice timestamp changes each time

### Test SSG

1. Run `npm run build`
2. Run `npm start`
3. Visit http://localhost:3000/static
4. Refresh - timestamp stays the same

### Test ISR

1. Visit http://localhost:3000/isr
2. Note the timestamp and random values
3. Wait 11 seconds
4. Refresh (shows stale page)
5. Refresh again (shows new data)

### Test On-Demand Revalidation

```bash
# In one terminal
npm run dev

# In another terminal
curl -X POST "http://localhost:3000/api/revalidate?path=/isr&secret=my-secret-token"

# Refresh http://localhost:3000/isr in browser
```

### Test Dynamic Routes

1. Visit http://localhost:3000/blog/hello-world
2. Click links to other posts
3. Try http://localhost:3000/blog/nonexistent (404 or on-demand generation)

### Test Catch-all Routes

1. Visit http://localhost:3000/products/electronics
2. Try different paths:
   - http://localhost:3000/products/electronics/laptops
   - http://localhost:3000/products/a/b/c/d/e
3. Notice all segments are captured

## Build Output Explained

When you run `npm run build`, you'll see:

```
○  Static    - Generated at build time
●  SSG       - Static Site Generation (with getStaticProps)
λ  Server    - Server-side renders at runtime (uses getServerSideProps)
ISR          - Incremental Static Regeneration (with revalidate)
```

**Example output:**

```
Pages:
  ○ /404
  ○ /500
  λ /                          # SSR (getServerSideProps)
  ● /blog/[slug]               # ISR (revalidate: 60)
    ├ /blog/hello-world
    ├ /blog/nextjs-12-features
    └ /blog/isr-explained
  ● /isr                       # ISR (revalidate: 10)
  ● /products/[...params]      # ISR (revalidate: 30)
    ├ /products/electronics
    └ /products/electronics/laptops
  ● /static                    # SSG

API Routes:
  λ /api/hello
  λ /api/revalidate
  λ /api/users/[id]
```

## Environment Variables

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit values:

```env
CUSTOM_ENV_VAR=your-value
API_URL=https://your-api.com
REVALIDATION_SECRET=change-this-secret
```

## Next Steps

1. **Read Documentation**
   - `README.md` - Overview and features
   - `FEATURES.md` - Feature reference
   - `TESTING.md` - Detailed testing guide

2. **Explore Code**
   - Check out the page components
   - Review data fetching methods
   - Examine API routes

3. **Modify and Experiment**
   - Change `revalidate` values
   - Add new pages
   - Create new API routes

4. **Deploy**
   - Deploy to Vercel: `vercel deploy`
   - Or other platforms (Netlify, AWS, etc.)

## Troubleshooting

### Port already in use

```bash
npx kill-port 3000
# Or use different port
PORT=3001 npm run dev
```

### TypeScript errors

```bash
npm run type-check
```

### Module not found

```bash
rm -rf node_modules
npm install
```

### Build errors

```bash
rm -rf .next
npm run build
```

### ISR not working

- ISR only works in production mode
- Run `npm run build && npm start`
- Wait for revalidation period
- First request after timeout shows stale page
- Second request shows fresh page

## Getting Help

- Check `README.md` for overview
- Check `FEATURES.md` for feature details
- Check `TESTING.md` for testing guide
- Next.js Docs: https://nextjs.org/docs

## Key Concepts Summary

| Feature        | File                       | Data Fetching                       | Use Case             |
| -------------- | -------------------------- | ----------------------------------- | -------------------- |
| SSR            | `index.tsx`                | `getServerSideProps`                | Real-time data       |
| SSG            | `static.tsx`               | `getStaticProps`                    | Static content       |
| ISR            | `isr.tsx`                  | `getStaticProps` + `revalidate`     | Semi-dynamic content |
| Dynamic Routes | `blog/[slug].tsx`          | `getStaticPaths` + `getStaticProps` | Blog posts           |
| Catch-all      | `products/[...params].tsx` | `getStaticPaths` + `getStaticProps` | Nested routes        |
| API Routes     | `api/hello.ts`             | N/A                                 | Backend endpoints    |

## Quick Reference

**Data Fetching:**

- `getServerSideProps` - SSR, every request
- `getStaticProps` - SSG, build time
- `getStaticProps` + `revalidate` - ISR, background regeneration
- `getStaticPaths` - Define dynamic routes to pre-generate

**Routing:**

- `pages/about.tsx` → `/about`
- `pages/blog/[slug].tsx` → `/blog/:slug`
- `pages/[...params].tsx` → `/*`

**API Routes:**

- `pages/api/hello.ts` → `/api/hello`
- `pages/api/users/[id].ts` → `/api/users/:id`

Happy coding!
