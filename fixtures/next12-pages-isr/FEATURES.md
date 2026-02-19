# Next.js 12 Pages Router Features Reference

This document provides a quick reference for all Next.js 12 features demonstrated in this fixture.

## Table of Contents

- [Data Fetching Methods](#data-fetching-methods)
- [Routing](#routing)
- [API Routes](#api-routes)
- [Special Files](#special-files)
- [Configuration](#configuration)
- [Performance Features](#performance-features)

---

## Data Fetching Methods

### getServerSideProps (SSR)

**File:** `pages/index.tsx`

Fetches data on every request. Use when you need fresh data on each page load.

```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      data: await fetchData(),
    },
  };
};
```

**Pros:**

- Always fresh data
- Access to request context (cookies, headers)
- SEO-friendly (server-rendered)

**Cons:**

- Slower than static (server processing on each request)
- Higher server load
- Cannot be cached by CDN

---

### getStaticProps (SSG)

**File:** `pages/static.tsx`

Generates page at build time. Use for content that rarely changes.

```typescript
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      data: await fetchData(),
    },
  };
};
```

**Pros:**

- Fastest performance (static HTML)
- Can be cached by CDN
- Low server load

**Cons:**

- Data is stale until rebuild
- Not suitable for frequently changing content

---

### getStaticProps with Revalidate (ISR)

**File:** `pages/isr.tsx`

Combines static generation with background revalidation. Best of both worlds.

```typescript
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      data: await fetchData(),
    },
    revalidate: 10, // Regenerate every 10 seconds
  };
};
```

**Pros:**

- Fast static performance
- Content stays fresh
- Low server load
- CDN cacheable

**Cons:**

- Small delay for first request after revalidation
- Complexity in cache invalidation

---

### getStaticPaths

**File:** `pages/blog/[slug].tsx`

Defines which dynamic routes to pre-generate at build time.

```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { slug: 'hello-world' } }, { params: { slug: 'nextjs-12-features' } }],
    fallback: 'blocking', // or false, true
  };
};
```

**Fallback options:**

- `false`: Only pre-generated paths exist (404 for others)
- `true`: Generate on-demand, show loading state
- `'blocking'`: Generate on-demand, wait before showing page

---

## Routing

### Static Routes

**Example:** `pages/static.tsx` → `/static`

Standard static routes.

---

### Dynamic Routes

**Example:** `pages/blog/[slug].tsx` → `/blog/:slug`

Matches single dynamic segment:

- `/blog/hello-world` ✓
- `/blog/nextjs-12-features` ✓
- `/blog/a/b` ✗

Access via `router.query.slug` or `params.slug`

---

### Catch-all Routes

**Example:** `pages/products/[...params].tsx` → `/products/*`

Matches any number of segments:

- `/products/electronics` ✓
- `/products/electronics/laptops` ✓
- `/products/electronics/laptops/gaming` ✓

Access via `router.query.params` (array)

---

### Optional Catch-all Routes

**Example:** `pages/[[...params]].tsx`

Same as catch-all but also matches the base route:

- `/` ✓
- `/a` ✓
- `/a/b` ✓

---

## API Routes

### Basic API Route

**File:** `pages/api/hello.ts`

```typescript
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello' });
}
```

**URL:** `/api/hello`

---

### Dynamic API Route

**File:** `pages/api/users/[id].ts`

```typescript
export default function handler(req, res) {
  const { id } = req.query;
  res.status(200).json({ id });
}
```

**URL:** `/api/users/123`

---

### API Route Features

- **HTTP Methods:** GET, POST, PUT, DELETE, etc.
- **Request:** `req.method`, `req.query`, `req.body`, `req.cookies`, `req.headers`
- **Response:** `res.status()`, `res.json()`, `res.send()`, `res.redirect()`
- **Middleware:** Body parsing, CORS, authentication

---

## Special Files

### \_app.tsx

**Purpose:** Initialize pages, persist layout, global state

```typescript
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

**Use cases:**

- Global CSS imports
- Layout persistence
- Global state (Redux, Context)
- Error boundaries
- Page transitions

---

### \_document.tsx

**Purpose:** Customize HTML document structure

```typescript
export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

**Use cases:**

- Custom fonts
- Meta tags
- Third-party scripts
- Language attributes
- Server-side only rendering

---

### 404.tsx

**Purpose:** Custom 404 error page

Automatically shown for non-existent routes.

---

### 500.tsx

**Purpose:** Custom 500 error page

Shown when server errors occur.

---

## Configuration

### next.config.js Features

**1. Compiler Options**

```javascript
{
  swcMinify: true, // Use SWC for minification
  reactStrictMode: true, // Enable React strict mode
}
```

**2. Image Optimization**

```javascript
{
  images: {
    domains: ['example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/webp'],
  }
}
```

**3. Redirects**

```javascript
{
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  }
}
```

**4. Rewrites**

```javascript
{
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  }
}
```

**5. Headers**

```javascript
{
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Custom-Header',
            value: 'my-value',
          },
        ],
      },
    ];
  }
}
```

**6. Environment Variables**

```javascript
{
  env: {
    CUSTOM_VAR: process.env.CUSTOM_VAR,
  }
}
```

**7. i18n**

```javascript
{
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  }
}
```

---

## Performance Features

### 1. Automatic Code Splitting

Every page is automatically code-split:

- Only necessary code is loaded
- Shared code is extracted
- Dynamic imports for client-side

### 2. Image Optimization

Use `next/image` for automatic:

- Lazy loading
- Responsive images
- WebP format conversion
- Blur placeholder

### 3. Font Optimization

Automatic font optimization:

- Inline font CSS
- Eliminate external requests
- Zero layout shift

### 4. Script Optimization

Use `next/script` for:

- Deferred loading
- Priority control
- No blocking render

### 5. Built-in CSS Support

- CSS Modules
- Global CSS
- Sass/SCSS
- CSS-in-JS (styled-jsx)

### 6. SWC Compiler

Rust-based compiler:

- 3x faster refresh
- 5x faster builds
- Replaces Babel/Terser

### 7. Webpack 5

Default in Next.js 12:

- Better tree-shaking
- Long-term caching
- Smaller bundles
- Module federation

---

## ISR Strategies

### 1. Time-based Revalidation

```typescript
export const getStaticProps = async () => {
  return {
    props: { data },
    revalidate: 60, // 60 seconds
  };
};
```

**Use case:** Content that updates on a schedule

---

### 2. On-Demand Revalidation

```typescript
// API route
await res.revalidate('/page-path');
```

**Use case:** Manual cache purging after CMS updates

---

### 3. Stale-While-Revalidate

ISR implements SWR pattern:

1. Serve stale content immediately
2. Regenerate in background
3. Swap with fresh content

---

## TypeScript Support

### Page Component Types

```typescript
import type { NextPage } from 'next';

const Page: NextPage<Props> = ({ data }) => {
  return <div>{data}</div>;
};
```

### Data Fetching Types

```typescript
import type { GetServerSideProps, GetStaticProps, GetStaticPaths } from 'next';

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  // ...
};
```

### API Route Types

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // ...
}
```

---

## Best Practices

### 1. Choose the Right Data Fetching Method

- **SSR** (`getServerSideProps`): Real-time data, personalized content
- **SSG** (`getStaticProps`): Marketing pages, documentation
- **ISR** (`getStaticProps` + `revalidate`): Blog posts, product pages
- **CSR** (Client-side): Dashboard, user-specific data

### 2. Optimize Images

Always use `next/image`:

```typescript
import Image from 'next/image';

<Image src="/logo.png" width={200} height={100} alt="Logo" />
```

### 3. Use Dynamic Imports

For heavy components:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if needed
});
```

### 4. Implement Error Boundaries

Catch errors in production:

```typescript
class ErrorBoundary extends React.Component {
  // ...
}
```

### 5. Monitor Performance

- Use Next.js Analytics
- Track Core Web Vitals
- Monitor ISR cache hits
- Analyze bundle size

---

## Migration Notes

### From Next.js 11 to 12

- SWC compiler is now default
- Webpack 5 is stable
- Middleware support added
- Improved performance

### To Next.js 13+ (App Router)

This fixture uses Pages Router. Next.js 13+ introduces:

- App Router (new paradigm)
- React Server Components
- Streaming
- Different data fetching patterns

For this fixture, stick with Pages Router as it's the focus.

---

## Resources

- [Next.js 12 Docs](https://nextjs.org/docs)
- [Data Fetching](https://nextjs.org/docs/basic-features/data-fetching)
- [Routing](https://nextjs.org/docs/routing/introduction)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
