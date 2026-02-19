# Migration Guide: Pages Router → App Router

This guide helps developers understand the differences between Next.js Pages Router and the new App Router introduced in Next.js 13.

## Side-by-Side Comparison

### Basic Page

#### Pages Router (Old)

```tsx
// pages/index.tsx
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div>
        <h1>Welcome</h1>
      </div>
    </>
  );
}
```

#### App Router (New)

```tsx
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
    </div>
  );
}
```

**Changes:**

- No need for `<Head>` component
- Export `metadata` object instead
- File is `app/page.tsx` not `pages/index.tsx`
- Server Component by default

---

### Data Fetching

#### Pages Router (Old)

```tsx
// pages/posts.tsx
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  return {
    props: { posts },
  };
}

export default function Posts({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

#### App Router (New)

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function Posts() {
  const posts = await getPosts();

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

**Changes:**

- No `getServerSideProps` needed
- Component itself can be `async`
- Fetch directly in component
- Simpler, more intuitive

---

### Dynamic Routes

#### Pages Router (Old)

```tsx
// pages/posts/[id].tsx
import { useRouter } from 'next/router';

export default function Post() {
  const router = useRouter();
  const { id } = router.query;

  return <h1>Post {id}</h1>;
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await fetchPost(params.id);
  return { props: { post } };
}
```

#### App Router (New)

```tsx
// app/posts/[id]/page.tsx
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`);
  return res.json();
}

export default async function Post({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return <h1>Post {post.id}</h1>;
}

// Optional: for static generation
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
```

**Changes:**

- `params` passed directly to component
- No `useRouter` needed for params
- `generateStaticParams` replaces `getStaticPaths`
- `getStaticProps` not needed
- Cleaner syntax

---

### API Routes

#### Pages Router (Old)

```tsx
// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ posts: [] });
  } else if (req.method === 'POST') {
    res.status(201).json({ success: true });
  }
}
```

#### App Router (New)

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ posts: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true }, { status: 201 });
}
```

**Changes:**

- Separate function per HTTP method
- No single `handler` function
- Better TypeScript support
- More explicit routing
- Supports streaming responses

---

### Layout / \_app.tsx

#### Pages Router (Old)

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav>Navigation</nav>
      <Component {...pageProps} />
      <footer>Footer</footer>
    </div>
  );
}
```

#### App Router (New)

```tsx
// app/layout.tsx
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>Navigation</nav>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

**Changes:**

- `layout.tsx` replaces `_app.tsx`
- Must include `<html>` and `<body>`
- Receives `children` not `Component`
- Can be nested (multiple layouts)
- No `pageProps` spreading needed

---

### Loading States

#### Pages Router (Old)

```tsx
// pages/posts.tsx
import { useState, useEffect } from 'react';

export default function Posts() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>{/* posts */}</div>;
}
```

#### App Router (New)

```tsx
// app/posts/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}

// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function Posts() {
  const posts = await getPosts();
  return <div>{/* posts */}</div>;
}
```

**Changes:**

- Separate `loading.tsx` file
- Automatic Suspense boundary
- No manual loading state
- Shows instantly on navigation
- Built-in pattern

---

### Error Handling

#### Pages Router (Old)

```tsx
// pages/posts.tsx
import { useState, useEffect } from 'react';

export default function Posts() {
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .catch((err) => setError(err));
  }, []);

  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* posts */}</div>;
}
```

#### App Router (New)

```tsx
// app/posts/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Error: {error.message}</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// app/posts/page.tsx
// Just throw errors, error.tsx will catch them
export default async function Posts() {
  const posts = await getPosts(); // throws on error
  return <div>{/* posts */}</div>;
}
```

**Changes:**

- Separate `error.tsx` file
- Automatic error boundary
- Reset functionality built-in
- Cleaner component code
- React Error Boundary pattern

---

### 404 Pages

#### Pages Router (Old)

```tsx
// pages/404.tsx
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}
```

#### App Router (New)

```tsx
// app/not-found.tsx
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

// Trigger programmatically:
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function Post({ params }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound(); // Shows app/not-found.tsx
  }

  return <div>{post.title}</div>;
}
```

**Changes:**

- File is `app/not-found.tsx`
- Can trigger with `notFound()` function
- More control over when to show 404

---

### Client Components

#### Pages Router (Old)

```tsx
// pages/counter.tsx
import { useState } from 'react';

// All components are client components
export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

#### App Router (New)

```tsx
// app/counter/page.tsx
'use client'; // Must specify client component

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

**Changes:**

- Must add `'use client'` directive
- Server Components are default
- Opt-in to client features
- Better performance (less JS by default)

---

### Metadata (SEO)

#### Pages Router (Old)

```tsx
// pages/about.tsx
import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="About our company" />
        <meta property="og:title" content="About Us" />
      </Head>
      <h1>About</h1>
    </>
  );
}
```

#### App Router (New)

```tsx
// app/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About our company',
  openGraph: {
    title: 'About Us',
  },
};

export default function About() {
  return <h1>About</h1>;
}
```

**Changes:**

- Export `metadata` object
- Type-safe with TypeScript
- No `<Head>` component needed
- Can generate dynamically with `generateMetadata()`
- Cleaner component code

---

### Nested Layouts

#### Pages Router (Old)

```tsx
// pages/_app.tsx
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

// pages/dashboard/index.tsx
import DashboardLayout from '@/components/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1>Dashboard</h1>
    </DashboardLayout>
  );
}

// Need to manually nest layouts
```

#### App Router (New)

```tsx
// app/layout.tsx (root)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

// app/dashboard/layout.tsx (nested)
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/page.tsx
export default function Dashboard() {
  return <h1>Dashboard</h1>;
}

// Layouts automatically nest
```

**Changes:**

- Automatic layout nesting
- File-based layout hierarchy
- Layouts persist across navigation
- Better code organization

---

## Feature Comparison Table

| Feature                    | Pages Router         | App Router              |
| -------------------------- | -------------------- | ----------------------- |
| **Default Component Type** | Client               | Server                  |
| **Data Fetching**          | `getServerSideProps` | `async` component       |
| **Static Generation**      | `getStaticProps`     | `fetch` with cache      |
| **API Routes**             | `pages/api/file.ts`  | `app/api/route.ts`      |
| **Metadata**               | `<Head>` component   | `metadata` export       |
| **Layouts**                | `_app.tsx`           | `layout.tsx` (nestable) |
| **Loading States**         | Manual               | `loading.tsx`           |
| **Error Handling**         | Manual               | `error.tsx`             |
| **404 Pages**              | `pages/404.tsx`      | `not-found.tsx`         |
| **Route Params**           | `useRouter` hook     | `params` prop           |
| **Streaming**              | Not built-in         | Native support          |
| **Parallel Routes**        | Not supported        | Native support          |
| **Route Groups**           | Not supported        | `(folder)` syntax       |

## Directory Structure Comparison

### Pages Router

```
project/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── about.tsx
│   ├── posts/
│   │   └── [id].tsx
│   └── api/
│       └── posts.ts
├── components/
├── styles/
│   └── globals.css
└── public/
```

### App Router

```
project/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── posts/
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── loading.tsx
│   ├── api/
│   │   └── posts/
│   │       └── route.ts
│   └── globals.css
├── components/
└── public/
```

## Migration Strategies

### 1. Gradual Migration (Recommended)

Next.js 13+ supports both routers simultaneously:

```
project/
├── app/           # New App Router routes
│   └── new-feature/
└── pages/         # Existing Pages Router routes
    └── old-routes/
```

**Pros:**

- Migrate incrementally
- Test each route
- Lower risk

**Cons:**

- Two routing systems temporarily
- More complex during transition

### 2. Full Migration

Convert entire app at once.

**Pros:**

- Clean architecture
- Consistent patterns
- Leverage all new features

**Cons:**

- Higher risk
- More upfront work
- Longer testing period

### 3. New Projects

Start with App Router only.

**Pros:**

- Latest patterns
- Best performance
- Future-proof

**Cons:**

- Learning curve
- Fewer examples (initially)

## Common Migration Tasks

### Task 1: Convert a Simple Page

```bash
# Old
pages/about.tsx

# New
app/about/page.tsx
```

1. Move file to `app/about/page.tsx`
2. Remove `<Head>`, add `metadata` export
3. Remove `getServerSideProps`, make component `async`
4. Test the route

### Task 2: Convert API Route

```bash
# Old
pages/api/posts.ts

# New
app/api/posts/route.ts
```

1. Create `app/api/posts/route.ts`
2. Split handler into HTTP method functions
3. Update imports to `next/server`
4. Test endpoints

### Task 3: Convert \_app.tsx

```bash
# Old
pages/_app.tsx

# New
app/layout.tsx
```

1. Create `app/layout.tsx`
2. Add `<html>` and `<body>` tags
3. Replace `Component` with `{children}`
4. Move global styles import
5. Test all pages

### Task 4: Add Loading States

```bash
# Create
app/posts/loading.tsx
```

1. Create `loading.tsx` in route folder
2. Move existing loading UI there
3. Remove manual loading state from page
4. Test loading behavior

### Task 5: Add Error Boundaries

```bash
# Create
app/posts/error.tsx
```

1. Create `error.tsx` in route folder
2. Add `'use client'` directive
3. Implement error UI with reset
4. Remove manual error handling from page
5. Test error scenarios

## Breaking Changes

### 1. Component Types

- **Old:** All components are Client Components
- **New:** Server Components by default
- **Fix:** Add `'use client'` to interactive components

### 2. Data Fetching

- **Old:** `getServerSideProps`, `getStaticProps`
- **New:** `async` components, `fetch` with caching
- **Fix:** Convert to async components

### 3. Metadata

- **Old:** `<Head>` component from `next/head`
- **New:** `metadata` export
- **Fix:** Export metadata object

### 4. useRouter

- **Old:** `useRouter` from `next/router`
- **New:** `useRouter` from `next/navigation`
- **Fix:** Update import (different API)

### 5. Route Parameters

- **Old:** `router.query`
- **New:** `params` prop
- **Fix:** Use params prop instead of hook

## Benefits of Migration

### Performance

- Smaller JavaScript bundles
- Faster initial page load
- Progressive rendering with Suspense
- Automatic code splitting

### Developer Experience

- Simpler data fetching
- Better TypeScript support
- Cleaner component code
- Built-in patterns for common tasks

### Features

- Streaming and Suspense
- Parallel routes
- Route groups
- Better error handling
- Nested layouts

### Future-Proof

- Active development
- New features coming
- Community adoption
- Better documentation

## Resources

- [Official Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [App Router Documentation](https://nextjs.org/docs/app)
- [Codemods for Migration](https://nextjs.org/docs/app/building-your-application/upgrading/codemods)
- [Next.js 13 Blog Post](https://nextjs.org/blog/next-13)

## Migration Checklist

- [ ] Understand Server vs Client Components
- [ ] Review App Router file conventions
- [ ] Plan migration strategy (gradual vs full)
- [ ] Convert `_app.tsx` to `layout.tsx`
- [ ] Convert simple pages first
- [ ] Add loading and error states
- [ ] Migrate API routes
- [ ] Update metadata handling
- [ ] Convert dynamic routes
- [ ] Update data fetching
- [ ] Test thoroughly
- [ ] Update documentation
- [ ] Train team on new patterns

## Conclusion

The App Router represents a significant evolution in Next.js. While migration requires effort, the benefits in performance, developer experience, and future capabilities make it worthwhile for most projects.

Start with new features in the App Router, then gradually migrate existing routes as you become comfortable with the new patterns.
