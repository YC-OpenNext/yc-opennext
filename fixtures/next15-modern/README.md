# Next.js 15 Modern Features Showcase

A comprehensive fixture demonstrating the latest features in Next.js 15, React 19, and Turbopack.

## Features Demonstrated

### Next.js 15 Features

#### 1. **Turbopack (Stable)**

- Rust-based bundler for faster development builds
- Up to 700x faster updates than Webpack
- Enable with `--turbo` flag

```bash
npm run dev --turbo
```

#### 2. **Partial Prerendering (PPR)**

- Experimental feature combining static and dynamic rendering
- Static shell loads instantly while dynamic content streams
- Configure in `next.config.js`:

```javascript
experimental: {
  ppr: 'incremental',
}
```

#### 3. **Enhanced Server Actions**

- Improved error handling and validation
- Better integration with React 19 hooks
- Progressive enhancement support
- Automatic pending states

#### 4. **Improved Caching**

- More granular control over fetch caching
- Better revalidation strategies
- Configurable cache behavior per route

#### 5. **Async Request APIs**

- Headers, cookies, and params are now async
- Better alignment with streaming architecture
- Improved type safety

### React 19 Features

#### 1. **useActionState Hook**

Replaces the previous `useFormState` hook with better server action integration:

```typescript
'use client';
import { useActionState } from 'react';

const [state, formAction, isPending] = useActionState(serverAction, initialState);
```

**Benefits:**

- Automatic pending states
- Better error handling
- Type-safe state management
- Progressive enhancement

#### 2. **useOptimistic Hook**

Provides optimistic UI updates before server confirmation:

```typescript
'use client';
import { useOptimistic } from 'react';

const [optimisticState, addOptimistic] = useOptimistic(state, (currentState, optimisticValue) => {
  // Return new optimistic state
});
```

**Benefits:**

- Instant UI feedback
- Automatic reconciliation with server state
- Better user experience
- Error recovery

#### 3. **useTransition Hook (Enhanced)**

Improved transitions for better user experience:

```typescript
const [isPending, startTransition] = useTransition();

startTransition(async () => {
  await serverAction();
});
```

### TypeScript 5.6+

- Strict mode enabled
- Latest TypeScript features
- Full type safety for Server Actions
- Improved inference

## Project Structure

```
next15-modern/
├── app/
│   ├── actions.ts              # Server action definitions
│   ├── layout.tsx              # Root layout with viewport config
│   ├── page.tsx                # Home page with feature overview
│   ├── globals.css             # Global styles
│   ├── form/
│   │   └── page.tsx            # useActionState demo
│   ├── optimistic/
│   │   └── page.tsx            # useOptimistic demo
│   ├── server-only/
│   │   └── page.tsx            # Server-only code demo
│   ├── partial/
│   │   └── page.tsx            # Partial prerendering demo
│   └── api/
│       └── action/
│           └── route.ts        # API route handlers
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- npm, yarn, or pnpm

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server with Turbopack
npm run dev --turbo

# Start without Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

```bash
npm run build
npm run start
```

### Type Checking

```bash
npm run type-check
```

## Key Pages

### 1. Home (`/`)

Overview of all Next.js 15 features with navigation to demos.

### 2. Form Demo (`/form`)

Demonstrates:

- `useActionState` hook from React 19
- Server-side form validation
- Progressive enhancement
- Automatic pending states
- Error handling

### 3. Optimistic Updates (`/optimistic`)

Demonstrates:

- `useOptimistic` hook from React 19
- Instant UI updates
- Todo list with optimistic add/toggle/delete
- Error recovery and reconciliation

### 4. Server-Only Code (`/server-only`)

Demonstrates:

- Server actions for expensive computations
- Security benefits (code never sent to client)
- Performance optimization
- Real-world use cases

### 5. Partial Prerendering (`/partial`)

Demonstrates:

- Static shell with instant load
- Dynamic content streaming
- Suspense boundaries
- Loading states

### 6. API Routes (`/api/action`)

Modern API route handlers with:

- GET, POST, PUT, DELETE, PATCH methods
- Type-safe request/response
- Built-in Web APIs
- Error handling

## Server Actions

All server actions are defined in `app/actions.ts` with the `'use server'` directive:

```typescript
'use server';

export async function submitContactForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Server-side validation and processing
}
```

**Benefits:**

- Type-safe server-client communication
- No API routes needed for most cases
- Automatic serialization
- Built-in security
- Progressive enhancement

## Configuration

### Next.js Config (`next.config.js`)

```javascript
const nextConfig = {
  experimental: {
    ppr: 'incremental', // Partial Prerendering
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000'],
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};
```

### TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "preserve"
  }
}
```

## What's New in Next.js 15?

### Breaking Changes

- `next/headers` APIs are now async (headers, cookies, params)
- Minimum React version is 19.0.0
- Node.js 18.18.0 minimum required

### New Features

- **Turbopack stable** for faster development
- **Partial Prerendering** (experimental)
- **React 19 support** with new hooks
- **Improved Server Actions** with better error handling
- **Enhanced caching** with more control
- **Better TypeScript support** with improved inference

### Deprecated

- `useFormState` → use `useActionState` instead
- `useFormStatus` is still supported but `useActionState` provides isPending

## Best Practices

1. **Use Server Actions** instead of API routes for data mutations
2. **Enable Turbopack** in development for faster builds
3. **Implement Optimistic Updates** for better UX
4. **Use Partial Prerendering** for faster page loads
5. **Keep server code secure** with 'use server' directive
6. **Type everything** with TypeScript for better DX
7. **Progressive Enhancement** - ensure forms work without JS

## Performance Tips

- Use `loading.tsx` for instant loading states
- Implement PPR for critical pages
- Leverage server components by default
- Use client components only when needed
- Optimize images with Next.js Image component
- Enable compression and remove powered-by header

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/blog/2024/12/05/react-19)
- [Turbopack Documentation](https://turbo.build/pack)
- [Server Actions Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

## License

MIT
