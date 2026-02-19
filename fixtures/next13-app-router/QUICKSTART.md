# Quick Start Guide - Next.js 13 App Router

This guide will get you up and running with the Next.js 13 App Router test fixture in under 5 minutes.

## Prerequisites

- Node.js 16.8 or later
- npm, yarn, or pnpm

## Installation

```bash
# Navigate to the fixture directory
cd /home/work/yc-opennext/fixtures/next13-app-router

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What to Explore

### 1. Server Components (Default)

Visit: [http://localhost:3000](http://localhost:3000)

The home page is a Server Component - notice:

- No JavaScript sent for the content
- Async data fetching on the server
- View page source to see fully rendered HTML

**File:** `app/page.tsx`

### 2. Client Components (Interactive)

Visit: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

The dashboard uses `'use client'` - notice:

- Interactive counter with state
- Live clock with useEffect
- Client-side data fetching

**File:** `app/dashboard/page.tsx`

### 3. Loading States

Visit: [http://localhost:3000/posts/1](http://localhost:3000/posts/1)

Watch the loading skeleton appear while data fetches.

**Files:**

- `app/posts/[id]/page.tsx` - Page with simulated delay
- `app/posts/[id]/loading.tsx` - Loading UI

### 4. Error Handling

Visit: [http://localhost:3000/posts/error](http://localhost:3000/posts/error)

See the error boundary catch and display errors.

**File:** `app/error.tsx`

### 5. Route Groups

Visit: [http://localhost:3000/about](http://localhost:3000/about)

Notice the URL is `/about`, not `/(marketing)/about`.

**File:** `app/(marketing)/about/page.tsx`

### 6. Parallel Routes

Visit: [http://localhost:3000/parallel](http://localhost:3000/parallel)

See multiple pages rendered simultaneously with independent loading.

**Files:**

- `app/parallel/layout.tsx`
- `app/parallel/@team/page.tsx`
- `app/parallel/@analytics/page.tsx`

### 7. Route Handlers (API)

Visit: [http://localhost:3000/api/posts](http://localhost:3000/api/posts)

See the new Route Handler API in action.

**File:** `app/api/posts/route.ts`

Test with curl:

```bash
# GET all posts
curl http://localhost:3000/api/posts

# GET with limit
curl http://localhost:3000/api/posts?limit=2

# POST new post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Test content"}'
```

### 8. Streaming API

Visit: [http://localhost:3000/api/stream](http://localhost:3000/api/stream)

See server-sent events streaming in real-time.

**File:** `app/api/stream/route.ts`

## Project Structure Overview

```
next13-app-router/
├── app/                          # App Router directory
│   ├── layout.tsx                # Root layout (required)
│   ├── page.tsx                  # Home page
│   ├── loading.tsx               # Loading UI
│   ├── error.tsx                 # Error boundary
│   │
│   ├── (marketing)/              # Route group
│   │   └── about/page.tsx        # About page
│   │
│   ├── posts/[id]/               # Dynamic route
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   ├── dashboard/                # Client component
│   │   └── page.tsx
│   │
│   ├── parallel/                 # Parallel routes
│   │   ├── @team/page.tsx
│   │   └── @analytics/page.tsx
│   │
│   └── api/                      # Route Handlers
│       ├── posts/route.ts
│       └── stream/route.ts
│
└── public/                       # Static assets
```

## Key Concepts

### Server Components (Default)

```tsx
// app/page.tsx
export default async function Page() {
  const data = await fetch('...');
  return <div>{data}</div>;
}
```

### Client Components (Interactive)

```tsx
// app/dashboard/page.tsx
'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Metadata API

```tsx
export const metadata = {
  title: 'My Page',
  description: 'Page description',
};
```

### Route Handlers

```tsx
// app/api/hello/route.ts
export async function GET(request: Request) {
  return Response.json({ hello: 'world' });
}
```

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## Environment Variables

Create `.env.local` for environment variables:

```bash
# Example
DATABASE_URL=postgresql://...
API_KEY=your-key-here
```

Access in Server Components:

```tsx
const apiKey = process.env.API_KEY;
```

## Building for Production

```bash
# Build the application
npm run build

# Output shows:
# - Static pages (○)
# - Server-side rendered pages (ƒ)
# - API routes (λ)

# Start production server
npm start
```

## File Naming Conventions

| File            | Purpose                              |
| --------------- | ------------------------------------ |
| `layout.tsx`    | Shared UI for a segment and children |
| `page.tsx`      | Unique UI for a route                |
| `loading.tsx`   | Loading UI for a segment             |
| `error.tsx`     | Error UI for a segment               |
| `not-found.tsx` | Not found UI                         |
| `route.ts`      | API endpoint                         |

## Routing Examples

| File Path                          | URL           |
| ---------------------------------- | ------------- |
| `app/page.tsx`                     | `/`           |
| `app/about/page.tsx`               | `/about`      |
| `app/blog/[slug]/page.tsx`         | `/blog/hello` |
| `app/(marketing)/contact/page.tsx` | `/contact`    |
| `app/api/users/route.ts`           | `/api/users`  |

## Tips

1. **Use Server Components by default** - Only add `'use client'` when needed
2. **Collocate files** - Keep components near where they're used
3. **Use loading.tsx** - Better UX than manual loading states
4. **Use error.tsx** - Automatic error boundaries
5. **Leverage async** - Fetch data directly in Server Components
6. **Type everything** - Use TypeScript for better DX

## Common Issues

### Issue: "You're importing a component that needs useState..."

**Solution:** Add `'use client'` at the top of the file

### Issue: "Metadata should not be exported from Client Components"

**Solution:** Move metadata to a parent Server Component or layout

### Issue: "Headers/Cookies are not supported in static generation"

**Solution:** Use `export const dynamic = 'force-dynamic'`

## Next Steps

1. Read the full README.md for detailed explanations
2. Explore each file to understand the patterns
3. Modify files and see live updates
4. Try adding your own routes and components
5. Check out the official docs: https://nextjs.org/docs/app

## Resources

- [Next.js 13 Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Support

For issues or questions:

- Check the README.md
- Review FIXTURE_SUMMARY.md
- Consult Next.js documentation
- Inspect the source code

Happy coding with Next.js 13 App Router!
