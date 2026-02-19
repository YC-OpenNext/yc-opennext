# Next.js 13 App Router Test Fixture

A comprehensive test fixture demonstrating the new **App Router** paradigm introduced in Next.js 13.

## Overview

Next.js 13 introduced the App Router, a fundamental shift in how Next.js applications are built. This fixture showcases all major features of the App Router, which became stable in Next.js 13.4.

## Key Features of Next.js 13 App Router

### 1. Server Components by Default

All components in the `app` directory are **React Server Components** by default:

- Zero JavaScript sent to the client
- Direct access to backend resources (databases, file system)
- Improved performance and reduced bundle size
- Can be async for data fetching

```tsx
// app/page.tsx - Server Component (default)
export default async function Page() {
  const data = await fetch('...');
  return <div>{data}</div>;
}
```

### 2. Client Components

Use the `'use client'` directive for interactive components:

```tsx
// app/dashboard/page.tsx
'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [count, setCount] = useState(0);
  // ...
}
```

### 3. New File Conventions

The App Router introduces special file names with built-in behavior:

- `layout.tsx` - Shared UI that wraps pages
- `page.tsx` - Unique UI for a route
- `loading.tsx` - Loading UI with Suspense
- `error.tsx` - Error UI boundary
- `not-found.tsx` - 404 UI
- `global-error.tsx` - Global error boundary
- `route.ts` - API endpoints (Route Handlers)

### 4. Nested Layouts

Layouts automatically nest and persist across navigations:

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx
└── (marketing)/
    ├── layout.tsx      # Nested marketing layout
    └── about/
        └── page.tsx    # Inherits both layouts
```

### 5. Route Groups

Organize routes without affecting URLs using `(folder)` syntax:

```
app/
├── (marketing)/
│   ├── about/page.tsx     # URL: /about
│   └── contact/page.tsx   # URL: /contact
└── (shop)/
    └── products/page.tsx  # URL: /products
```

### 6. Dynamic Routes

Dynamic segments use `[param]` syntax:

```
app/
└── posts/
    └── [id]/
        ├── page.tsx      # URL: /posts/1, /posts/2, etc.
        └── loading.tsx   # Route-specific loading
```

### 7. Parallel Routes

Render multiple pages simultaneously in the same layout:

```
app/
└── parallel/
    ├── layout.tsx        # Receives all slots as props
    ├── page.tsx          # Default slot
    ├── @team/
    │   └── page.tsx      # Team slot
    └── @analytics/
        └── page.tsx      # Analytics slot
```

### 8. Route Handlers (New API Routes)

Replace `pages/api/*` with `app/api/*/route.ts`:

```typescript
// app/api/posts/route.ts
export async function GET(request: Request) {
  return Response.json({ data: '...' });
}

export async function POST(request: Request) {
  const body = await request.json();
  // ...
}
```

### 9. Metadata API

Type-safe metadata without `next/head`:

```typescript
// Static metadata
export const metadata = {
  title: 'Page Title',
  description: '...',
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  return {
    title: `Post ${params.id}`,
  };
}
```

### 10. Streaming and Suspense

Built-in support for progressive rendering:

```tsx
// Loading UI shown while page loads
export default function Loading() {
  return <Spinner />;
}
```

## Project Structure

```
next13-app-router/
├── app/
│   ├── layout.tsx                    # Root layout with Metadata API
│   ├── page.tsx                      # Home page (Server Component)
│   ├── loading.tsx                   # Root loading UI
│   ├── error.tsx                     # Error boundary
│   ├── not-found.tsx                 # 404 page
│   ├── global-error.tsx              # Global error handler
│   │
│   ├── (marketing)/                  # Route group
│   │   ├── layout.tsx                # Marketing layout
│   │   └── about/
│   │       └── page.tsx              # About page (/about)
│   │
│   ├── posts/
│   │   └── [id]/                     # Dynamic route
│   │       ├── page.tsx              # Dynamic post page
│   │       └── loading.tsx           # Post loading UI
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # Client Component example
│   │
│   ├── parallel/                     # Parallel routes
│   │   ├── layout.tsx                # Layout with slots
│   │   ├── page.tsx                  # Default content
│   │   ├── @team/
│   │   │   └── page.tsx              # Team slot
│   │   └── @analytics/
│   │       └── page.tsx              # Analytics slot
│   │
│   ├── api/
│   │   ├── posts/
│   │   │   └── route.ts              # Route Handler (CRUD)
│   │   └── stream/
│   │       └── route.ts              # Streaming response
│   │
│   └── globals.css                   # Global styles
│
├── public/
│   └── favicon.ico
│
├── next.config.js
├── tsconfig.json
└── package.json
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Features Demonstrated

### Server Components

- **app/page.tsx** - Async Server Component with data fetching
- **app/posts/[id]/page.tsx** - Dynamic Server Component
- **app/(marketing)/about/page.tsx** - Server Component in route group

### Client Components

- **app/dashboard/page.tsx** - Interactive component with state and effects

### Layouts

- **app/layout.tsx** - Root layout with Metadata API
- **app/(marketing)/layout.tsx** - Nested layout for marketing pages

### Loading States

- **app/loading.tsx** - Root loading UI
- **app/posts/[id]/loading.tsx** - Route-specific loading

### Error Handling

- **app/error.tsx** - Error boundary for app routes
- **app/global-error.tsx** - Global error handler
- **app/not-found.tsx** - Custom 404 page

### Route Handlers (API)

- **app/api/posts/route.ts** - Full CRUD operations (GET, POST, PATCH, DELETE)
- **app/api/stream/route.ts** - Streaming responses

### Advanced Routing

- **app/(marketing)/** - Route groups
- **app/posts/[id]/** - Dynamic routes
- **app/parallel/** - Parallel routes with multiple slots

## Server vs Client Components

### When to Use Server Components (Default)

- Fetch data from backend
- Access database or file system
- Keep sensitive information on server
- Reduce client-side JavaScript

### When to Use Client Components ('use client')

- Add interactivity and event listeners
- Use React hooks (useState, useEffect, etc.)
- Use browser-only APIs
- Use React Context

## Metadata API

The new Metadata API provides type-safe metadata without `next/head`:

```typescript
// Static metadata
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  return {
    title: post.title,
  };
}
```

## Data Fetching

### Server Components (Recommended)

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}
```

### Client Components

```tsx
'use client';

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{data}</div>;
}
```

## Route Handlers

Replace `pages/api/*` with type-safe Route Handlers:

```typescript
// app/api/posts/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  return Response.json({ data: '...' });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Process data
  return Response.json({ success: true });
}
```

## Testing the Fixture

### Test Server Components

1. Visit `/` to see the home page (Server Component)
2. Check the page source - no JavaScript for the content

### Test Loading UI

1. Visit `/posts/1`
2. Notice the loading skeleton while data fetches

### Test Error Handling

1. Visit `/posts/error` to trigger an error
2. See the error boundary in action

### Test Client Components

1. Visit `/dashboard`
2. Interact with the counter and see client-side state

### Test Route Handlers

1. Visit `/api/posts` to see JSON response
2. Use curl or Postman to test POST, PATCH, DELETE

### Test Parallel Routes

1. Visit `/parallel`
2. See multiple slots rendered simultaneously

## Migration from Pages Router

Key differences:

| Feature       | Pages Router     | App Router           |
| ------------- | ---------------- | -------------------- |
| Directory     | `pages/`         | `app/`               |
| File for page | `page.tsx`       | `page.tsx`           |
| API routes    | `pages/api/`     | `app/api/*/route.ts` |
| Metadata      | `<Head>`         | `metadata` export    |
| Loading       | Custom           | `loading.tsx`        |
| Error         | Custom           | `error.tsx`          |
| Layout        | `_app.tsx`       | `layout.tsx`         |
| Default       | Client Component | Server Component     |

## Browser Support

Next.js 13 supports:

- Chrome 64+
- Edge 79+
- Firefox 67+
- Opera 51+
- Safari 12+

## Resources

- [Next.js 13 Documentation](https://nextjs.org/docs)
- [App Router Documentation](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

## Version Info

- Next.js: 13.5.6 (latest v13)
- React: 18.2.0
- TypeScript: 5.1.6

This fixture represents the stable state of the App Router as it existed in Next.js 13.
