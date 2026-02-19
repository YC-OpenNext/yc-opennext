# Next.js 13 App Router Architecture

This document explains the architecture and design decisions of this test fixture.

## Visual Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js 13 App Router                       │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    app/layout.tsx                         │ │
│  │            Root Layout (Server Component)                  │ │
│  │         - Metadata API                                     │ │
│  │         - Global Navigation                                │ │
│  │         - Wraps all pages                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│              ┌───────────────┼───────────────┐                 │
│              │               │               │                 │
│    ┌─────────▼────────┐ ┌───▼────────┐ ┌────▼─────────┐       │
│    │   Home Route     │ │  Marketing │ │ Dynamic Post │       │
│    │   app/page.tsx   │ │   Group    │ │  posts/[id]  │       │
│    │                  │ │ (marketing)│ │              │       │
│    │  Server Comp     │ └────┬───────┘ │ Server Comp  │       │
│    │  Async fetch     │      │         │ Dynamic Meta │       │
│    │  Zero JS         │      │         │ Loading UI   │       │
│    └──────────────────┘      │         └──────────────┘       │
│                               │                                 │
│                    ┌──────────▼────────────┐                   │
│                    │  (marketing)/layout   │                   │
│                    │   Nested Layout       │                   │
│                    └──────────┬────────────┘                   │
│                               │                                 │
│                    ┌──────────▼────────────┐                   │
│                    │ (marketing)/about     │                   │
│                    │   Route Group Page    │                   │
│                    │   URL: /about         │                   │
│                    └───────────────────────┘                   │
│                                                                 │
│    ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│    │   Dashboard    │  │   Parallel   │  │   API Routes    │  │
│    │                │  │    Routes    │  │                 │  │
│    │ Client Comp    │  │              │  │ Route Handlers  │  │
│    │ 'use client'   │  │ @team        │  │                 │  │
│    │ Interactive    │  │ @analytics   │  │ /api/posts      │  │
│    │ React Hooks    │  │ layout.tsx   │  │ /api/stream     │  │
│    └────────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
┌─ RootLayout (app/layout.tsx)
│  ├─ Navigation
│  ├─ Header
│  └─ Main Content Area
│     │
│     ├─ HomePage (app/page.tsx) ────────────── Server Component
│     │  └─ Loading: app/loading.tsx
│     │
│     ├─ MarketingGroup (app/(marketing))
│     │  ├─ MarketingLayout ───────────────── Nested Layout
│     │  │  ├─ Sidebar
│     │  │  └─ Content
│     │  │     └─ AboutPage ────────────────── Server Component
│     │
│     ├─ PostsRoute (app/posts/[id])
│     │  ├─ PostPage ──────────────────────── Server Component
│     │  │  └─ Dynamic Metadata
│     │  └─ Loading: posts/[id]/loading.tsx
│     │
│     ├─ DashboardPage (app/dashboard) ────── Client Component
│     │  ├─ Counter (useState)
│     │  ├─ Clock (useEffect)
│     │  └─ Data Fetching (useEffect)
│     │
│     └─ ParallelRoute (app/parallel)
│        ├─ ParallelLayout ─────────────────── Multi-slot Layout
│        │  ├─ Main: page.tsx
│        │  ├─ @team: @team/page.tsx ────── Parallel Slot 1
│        │  └─ @analytics: @analytics/page.tsx ── Parallel Slot 2
│
└─ Error Boundaries
   ├─ app/error.tsx ──────────────────────── Route Error
   ├─ app/global-error.tsx ───────────────── Global Error
   └─ app/not-found.tsx ──────────────────── 404 Handler
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Server Components                       │
│                                                              │
│  ┌────────────┐                                             │
│  │ app/page   │  async getData() {                          │
│  │            │    const res = await fetch(...)             │
│  │ Server     │    return res.json()                        │
│  │ Component  │  }                                           │
│  │            │                                             │
│  └────────────┘  ┌─────────────────────────┐               │
│                  │ Direct Backend Access    │               │
│                  │ - Database queries       │               │
│                  │ - File system access     │               │
│                  │ - Secrets/API keys OK   │               │
│                  │ - No browser APIs        │               │
│                  └─────────────────────────┘               │
│                                                              │
│  Rendered on Server → HTML sent to browser → Zero JS        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Client Components                       │
│                                                              │
│  ┌────────────┐  'use client'                               │
│  │ dashboard/ │                                             │
│  │ page.tsx   │  useEffect(() => {                          │
│  │            │    fetch('/api/posts')                      │
│  │ Client     │      .then(setData)                         │
│  │ Component  │  }, [])                                     │
│  │            │                                             │
│  └────────────┘  ┌─────────────────────────┐               │
│                  │ Browser-Only Features    │               │
│                  │ - useState/useEffect     │               │
│                  │ - Event handlers         │               │
│                  │ - Browser APIs           │               │
│                  │ - Real-time updates      │               │
│                  └─────────────────────────┘               │
│                                                              │
│  JS Bundle → Hydration → Interactive                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Route Handlers                          │
│                                                              │
│  app/api/posts/route.ts                                     │
│                                                              │
│  export async function GET(request: Request) {              │
│    return Response.json({ data })                           │
│  }                                                           │
│                                                              │
│  ┌─────────────────────────┐                                │
│  │ Server-Side Endpoints   │                                │
│  │ - HTTP methods          │                                │
│  │ - Request/Response      │                                │
│  │ - Streaming support     │                                │
│  │ - Middleware compatible │                                │
│  └─────────────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

## Routing Architecture

```
URL Mapping:
─────────────────────────────────────────────────────────
URL                     File                         Type
─────────────────────────────────────────────────────────
/                      app/page.tsx                 Static
/about                 app/(marketing)/about/page   Static
/posts/1               app/posts/[id]/page          Dynamic
/dashboard             app/dashboard/page           Static
/parallel              app/parallel/page            Static
/api/posts             app/api/posts/route          API
/api/stream            app/api/stream/route         API
─────────────────────────────────────────────────────────

Route Groups (Don't affect URL):
─────────────────────────────────────────────────────────
Folder                 URL Impact
─────────────────────────────────────────────────────────
(marketing)            None - organizational only
(shop)                 None - can have own layout
(dashboard)            None - can have auth layout
─────────────────────────────────────────────────────────

Dynamic Segments:
─────────────────────────────────────────────────────────
Pattern                Example URLs
─────────────────────────────────────────────────────────
[id]                   /posts/1, /posts/2, /posts/abc
[slug]                 /blog/hello, /blog/world
[...slug]              /docs/a/b/c (catch-all)
[[...slug]]            /docs or /docs/a/b (optional)
─────────────────────────────────────────────────────────
```

## Loading & Error Flow

```
Request → Loading UI → Data Fetch → Render Success
                                   └→ Error Boundary
                                   └→ Not Found

┌─────────────────────────────────────────────────────────────┐
│  Request: /posts/1                                          │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  Show: app/posts/[id]/loading.tsx                           │
│  (Skeleton UI with suspense)                                │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│  Fetch: async function getPost(id)                          │
│         await fetch(...) or database query                  │
└────────────┬───────────────────┬────────────────────────────┘
             │                   │
      Success │                  │ Error
             ▼                   ▼
  ┌──────────────────┐   ┌─────────────────┐
  │ Render:          │   │ Show:           │
  │ posts/[id]/page  │   │ app/error.tsx   │
  │                  │   │ (Error boundary)│
  └──────────────────┘   └─────────────────┘
             │
    Post not found?
             │
             ▼
  ┌──────────────────┐
  │ notFound()       │
  │ Show:            │
  │ app/not-found    │
  └──────────────────┘
```

## Metadata Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Metadata Cascade                          │
└─────────────────────────────────────────────────────────────┘

app/layout.tsx
├─ metadata: {
│    title: { default: 'App', template: '%s | App' }
│    description: 'Base description'
│  }
│
├─ app/posts/[id]/page.tsx
│  └─ generateMetadata({ params }) {
│       return {
│         title: `Post ${params.id}`,  → "Post 1 | App"
│         description: 'Post specific'  → Overrides base
│       }
│     }
│
└─ app/(marketing)/about/page.tsx
   └─ metadata: {
        title: 'About',                 → "About | App"
        keywords: ['about', 'company']  → Merges with base
      }

Output <head>:
<title>Post 1 | App</title>
<meta name="description" content="Post specific" />
<meta name="keywords" content="about, company" />
```

## File Convention Architecture

```
app/
├── layout.tsx          ← Root Layout (Required)
│   ├── Wraps all pages
│   ├── Persists across navigation
│   ├── Can't access route params
│   └── Receives children prop
│
├── page.tsx            ← Page Component (Required for route)
│   ├── Unique to route
│   ├── Can be Server or Client Component
│   ├── Can export metadata
│   └── Receives params & searchParams
│
├── loading.tsx         ← Loading UI (Optional)
│   ├── Wraps page in <Suspense>
│   ├── Shows while page loads
│   ├── Instant navigation feedback
│   └── Must be Client Component if interactive
│
├── error.tsx           ← Error Boundary (Optional)
│   ├── Catches errors in page
│   ├── Must be Client Component
│   ├── Receives error & reset props
│   └── Doesn't catch layout errors
│
├── not-found.tsx       ← 404 UI (Optional)
│   ├── Triggered by notFound()
│   ├── Can be Server Component
│   └── Scoped to route segment
│
├── global-error.tsx    ← Global Error (Optional)
│   ├── Catches errors in root layout
│   ├── Must be Client Component
│   ├── Must define <html> and <body>
│   └── Only activates in production
│
└── route.ts            ← API Route (Optional)
    ├── Replaces pages/api
    ├── Exports HTTP methods
    ├── GET, POST, PUT, PATCH, DELETE
    └── Can't coexist with page.tsx
```

## Parallel Routes Architecture

```
app/parallel/layout.tsx receives props:
─────────────────────────────────────────────────────────
export default function Layout({
  children,     ← app/parallel/page.tsx
  team,         ← app/parallel/@team/page.tsx
  analytics,    ← app/parallel/@analytics/page.tsx
}) { ... }

Visual Layout:
┌─────────────────────────────────────────────────────────┐
│                    Parallel Layout                      │
├─────────────────────────────────────────────────────────┤
│                      {children}                         │
│                   Main Page Content                     │
├────────────────────────────┬────────────────────────────┤
│         {team}             │       {analytics}          │
│    @team/page.tsx          │   @analytics/page.tsx      │
│                            │                            │
│  Independent loading       │   Independent loading      │
│  Independent errors        │   Independent errors       │
│  Independent navigation    │   Independent navigation   │
└────────────────────────────┴────────────────────────────┘

Use Cases:
- Dashboard with multiple data sources
- Split views (e.g., email client)
- Modal dialogs (@modal slot)
- Conditional rendering
- A/B testing different sections
```

## Build Output Architecture

```
npm run build
─────────────────────────────────────────────────────────

Route (app)                      Size     Type
─────────────────────────────────────────────────────────
○ /                              1.2 kB   Static
○ /_not-found                    871 B    Static
○ /about                         1.3 kB   Static
ƒ /api/posts                     0 B      API
ƒ /api/stream                    0 B      API
○ /dashboard                     2.1 kB   Static
ƒ /parallel                      1.8 kB   SSR
ƒ /posts/[id]                    1.5 kB   SSR

Legend:
○  Static              - Pre-rendered at build time
ƒ  Server-Side (SSR)   - Rendered at request time
λ  API Route           - Serverless function

Benefits:
- Static pages → CDN cached, instant load
- SSR pages → Fresh data, personalized
- API routes → Serverless, auto-scaling
```

## Performance Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Performance Optimizations                       │
└─────────────────────────────────────────────────────────────┘

Server Components:
├─ Zero JavaScript for non-interactive content
├─ Automatic code splitting per route
├─ Streaming HTML (progressive rendering)
└─ Backend resource access (no API calls)

Client Components:
├─ Only interactive parts sent as JS
├─ Smaller bundle sizes
├─ Lazy loading by default
└─ Code splitting at 'use client' boundary

Loading States:
├─ Instant navigation feedback
├─ Suspense boundaries
├─ Skeleton UI while fetching
└─ Parallel data fetching

Route Handlers:
├─ Edge-compatible (can run on edge)
├─ Streaming responses
├─ Request/response caching
└─ Middleware integration

Images & Fonts:
├─ Automatic font optimization
├─ Next/image with AVIF/WebP
├─ Lazy loading images
└─ Responsive images
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Boundaries                       │
└─────────────────────────────────────────────────────────────┘

Server Components (Secure):
✓ API keys and secrets safe
✓ Database queries secure
✓ No exposure to client
✓ Server-side validation

                    Network Boundary
─────────────────────────────────────────────────────────

Client Components (Public):
✗ All code visible to client
✗ API keys exposed if included
✗ Can be tampered with
✓ Client-side validation only (UX)

Best Practices:
1. Keep secrets in Server Components
2. Validate on server (Route Handlers)
3. Use environment variables (.env)
4. Never send sensitive data to Client Components
5. Sanitize user input on server
```

## Architecture Decisions

### Why Server Components by Default?

1. Better performance (zero JS)
2. Direct backend access
3. Security (secrets stay on server)
4. SEO friendly (fully rendered HTML)

### Why File-Based Routing?

1. Intuitive structure
2. Automatic code splitting
3. Built-in conventions (loading, error)
4. Type-safe with TypeScript

### Why Route Handlers over pages/api?

1. Same App Router conventions
2. Better TypeScript support
3. Streaming support
4. Edge runtime compatible

### Why Parallel Routes?

1. Independent loading states
2. Complex layouts
3. Modal patterns
4. Conditional rendering

## Summary

This architecture demonstrates:

- Clear separation of Server/Client Components
- Built-in error and loading states
- Type-safe routing and metadata
- Scalable project structure
- Performance optimizations
- Modern React patterns

The fixture is designed to showcase real-world patterns while maintaining simplicity for learning and testing.
