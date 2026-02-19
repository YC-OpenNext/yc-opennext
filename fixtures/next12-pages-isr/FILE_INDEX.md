# File Index - Next.js 12 Pages Router ISR Fixture

Complete listing of all files in this fixture with descriptions.

## Root Directory

| File             | Type   | Description                                |
| ---------------- | ------ | ------------------------------------------ |
| `package.json`   | Config | Dependencies and scripts (Next.js 12.3.4)  |
| `tsconfig.json`  | Config | TypeScript configuration with path aliases |
| `next.config.js` | Config | Next.js configuration (SWC, images, i18n)  |
| `.eslintrc.json` | Config | ESLint configuration                       |
| `.gitignore`     | Config | Git ignore patterns                        |
| `.env.example`   | Config | Environment variables template             |
| `README.md`      | Docs   | Main documentation and overview            |
| `QUICKSTART.md`  | Docs   | Quick start guide                          |
| `TESTING.md`     | Docs   | Comprehensive testing guide                |
| `FEATURES.md`    | Docs   | Feature reference and patterns             |
| `OVERVIEW.md`    | Docs   | Complete project overview                  |
| `FILE_INDEX.md`  | Docs   | This file - complete file listing          |

## pages/

Main application pages using Pages Router.

| File            | Route     | Type    | Description                       |
| --------------- | --------- | ------- | --------------------------------- |
| `index.tsx`     | `/`       | SSR     | Home page with getServerSideProps |
| `static.tsx`    | `/static` | SSG     | Static page with getStaticProps   |
| `isr.tsx`       | `/isr`    | ISR     | ISR page (revalidate: 10 seconds) |
| `404.tsx`       | `/404`    | Static  | Custom 404 error page             |
| `500.tsx`       | `/500`    | Static  | Custom 500 error page             |
| `_app.tsx`      | N/A       | Special | Custom App component              |
| `_document.tsx` | N/A       | Special | Custom Document component         |

## pages/blog/

Dynamic blog routes with ISR.

| File         | Route         | Type | Description                          |
| ------------ | ------------- | ---- | ------------------------------------ |
| `[slug].tsx` | `/blog/:slug` | ISR  | Dynamic blog posts (revalidate: 60s) |

**Pre-generated paths:**

- `/blog/hello-world`
- `/blog/nextjs-12-features`
- `/blog/isr-explained`

## pages/products/

Catch-all routes for product categories.

| File              | Route         | Type | Description                       |
| ----------------- | ------------- | ---- | --------------------------------- |
| `[...params].tsx` | `/products/*` | ISR  | Catch-all route (revalidate: 30s) |

**Examples:**

- `/products/electronics`
- `/products/electronics/laptops`
- `/products/electronics/laptops/gaming`

## pages/api/

API route handlers.

| File            | Route             | Methods | Description                        |
| --------------- | ----------------- | ------- | ---------------------------------- |
| `hello.ts`      | `/api/hello`      | GET     | Basic API route with JSON response |
| `revalidate.ts` | `/api/revalidate` | POST    | On-demand ISR revalidation         |

## pages/api/users/

Dynamic API routes for user operations.

| File      | Route            | Methods          | Description               |
| --------- | ---------------- | ---------------- | ------------------------- |
| `[id].ts` | `/api/users/:id` | GET, PUT, DELETE | CRUD operations for users |

**Available IDs:** 123, 456, 789

## components/

Reusable React components.

| File         | Usage     | Description                            |
| ------------ | --------- | -------------------------------------- |
| `Layout.tsx` | All pages | Main layout wrapper with header/footer |
| `Header.tsx` | Layout    | Navigation header with active links    |
| `Footer.tsx` | Layout    | Site footer with links and info        |

## styles/

CSS styling files.

| File              | Type   | Description                                 |
| ----------------- | ------ | ------------------------------------------- |
| `globals.css`     | Global | Global styles, reset, typography, utilities |
| `Home.module.css` | Module | CSS Modules for page components             |

## public/

Static assets served directly.

| File              | Path           | Description                     |
| ----------------- | -------------- | ------------------------------- |
| `favicon.ico`     | `/favicon.ico` | Placeholder favicon             |
| `robots.txt`      | `/robots.txt`  | SEO robots configuration        |
| `images/.gitkeep` | N/A            | Placeholder for image directory |

## File Statistics

```
Total Files: 31
├── TypeScript/JavaScript: 16 files
│   ├── Pages: 10 files
│   ├── API Routes: 3 files
│   └── Components: 3 files
├── Documentation: 6 files
├── Configuration: 6 files
├── Styles: 2 files
└── Public Assets: 3 files
```

## Lines of Code

```
TypeScript/TSX: ~2000 lines
├── Pages: ~1200 lines
├── Components: ~400 lines
└── API Routes: ~400 lines

CSS: ~500 lines
Documentation: ~2500 lines
Configuration: ~200 lines

Total: ~5200 lines
```

## Key Files by Feature

### Server-Side Rendering (SSR)

- `pages/index.tsx` - Home page with real-time data

### Static Site Generation (SSG)

- `pages/static.tsx` - Pure static page

### Incremental Static Regeneration (ISR)

- `pages/isr.tsx` - ISR with 10-second revalidation
- `pages/blog/[slug].tsx` - Dynamic ISR with 60-second revalidation
- `pages/products/[...params].tsx` - Catch-all ISR with 30-second revalidation
- `pages/api/revalidate.ts` - On-demand revalidation API

### Dynamic Routing

- `pages/blog/[slug].tsx` - Single parameter
- `pages/products/[...params].tsx` - Catch-all parameters
- `pages/api/users/[id].ts` - Dynamic API route

### Error Handling

- `pages/404.tsx` - Not found errors
- `pages/500.tsx` - Server errors

### Configuration

- `next.config.js` - Next.js settings
- `tsconfig.json` - TypeScript settings
- `.eslintrc.json` - Linting rules
- `.env.example` - Environment variables

### Documentation

- `README.md` - Start here for overview
- `QUICKSTART.md` - Get running quickly
- `TESTING.md` - Test all features
- `FEATURES.md` - Learn patterns and best practices
- `OVERVIEW.md` - Comprehensive summary
- `FILE_INDEX.md` - This file

## Import Paths

The fixture uses TypeScript path aliases:

```typescript
// Components
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Styles
import '@/styles/globals.css';
import styles from '@/styles/Home.module.css';
```

## Next.js Special Files

| File            | Purpose                         | Server/Client |
| --------------- | ------------------------------- | ------------- |
| `_app.tsx`      | Initialize pages, global layout | Both          |
| `_document.tsx` | HTML document structure         | Server only   |
| `404.tsx`       | Custom 404 page                 | Both          |
| `500.tsx`       | Custom 500 page                 | Both          |

## Data Fetching Files

| File                             | Function                            | When          | Cache   |
| -------------------------------- | ----------------------------------- | ------------- | ------- |
| `pages/index.tsx`                | `getServerSideProps`                | Every request | No      |
| `pages/static.tsx`               | `getStaticProps`                    | Build time    | Forever |
| `pages/isr.tsx`                  | `getStaticProps` + `revalidate`     | Build + 10s   | 10s     |
| `pages/blog/[slug].tsx`          | `getStaticPaths` + `getStaticProps` | Build + 60s   | 60s     |
| `pages/products/[...params].tsx` | `getStaticPaths` + `getStaticProps` | Build + 30s   | 30s     |

## File Dependencies

```
pages/_app.tsx
├── styles/globals.css
└── pages/*.tsx (all pages)

pages/*.tsx
├── components/Layout.tsx
│   ├── components/Header.tsx
│   └── components/Footer.tsx
└── styles/Home.module.css

pages/_document.tsx
└── (No dependencies - server only)
```

## Recommended Reading Order

### For Beginners

1. `README.md` - Understand the fixture
2. `QUICKSTART.md` - Get it running
3. `pages/index.tsx` - See SSR in action
4. `pages/static.tsx` - See SSG
5. `pages/isr.tsx` - See ISR

### For Intermediate

1. `FEATURES.md` - Learn patterns
2. `pages/blog/[slug].tsx` - Dynamic routes
3. `pages/products/[...params].tsx` - Catch-all routes
4. `pages/api/` - API routes
5. `TESTING.md` - Test everything

### For Advanced

1. `OVERVIEW.md` - Big picture
2. `next.config.js` - Configuration
3. `tsconfig.json` - TypeScript setup
4. All files - Deep dive

## File Modification Guide

### Safe to Modify

- All `pages/*.tsx` files (experiment freely)
- `components/*.tsx` files
- `styles/*.css` files
- `.env.local` (create from `.env.example`)
- Documentation files (your notes)

### Modify with Caution

- `next.config.js` - Break build if misconfigured
- `tsconfig.json` - May cause type errors
- `package.json` - May cause dependency issues

### Don't Modify

- `.gitignore` - Standard Next.js ignores
- `.eslintrc.json` - Standard Next.js linting

## Build Output Files

After running `npm run build`, these directories/files are created:

```
.next/                    # Build output (gitignored)
├── cache/               # Build cache
├── server/              # Server bundles
├── static/              # Static assets
└── BUILD_ID             # Build identifier

node_modules/            # Dependencies (gitignored)
next-env.d.ts            # Next.js types (auto-generated)
```

## Version Information

| Package          | Version  | Type        |
| ---------------- | -------- | ----------- |
| Next.js          | 12.3.4   | Production  |
| React            | 18.2.0   | Production  |
| React DOM        | 18.2.0   | Production  |
| TypeScript       | 4.9.4    | Development |
| ESLint           | 8.31.0   | Development |
| @types/node      | 18.11.18 | Development |
| @types/react     | 18.0.26  | Development |
| @types/react-dom | 18.0.10  | Development |

## Quick File Lookup

Need to find a file quickly? Use this guide:

**Want to see SSR?** → `pages/index.tsx`  
**Want to see SSG?** → `pages/static.tsx`  
**Want to see ISR?** → `pages/isr.tsx`  
**Want to see dynamic routes?** → `pages/blog/[slug].tsx`  
**Want to see catch-all?** → `pages/products/[...params].tsx`  
**Want to see API routes?** → `pages/api/hello.ts`  
**Want to configure Next.js?** → `next.config.js`  
**Want to add components?** → `components/`  
**Want to add styles?** → `styles/`  
**Want to learn?** → `README.md` or `QUICKSTART.md`  
**Want to test?** → `TESTING.md`  
**Want deep dive?** → `FEATURES.md` or `OVERVIEW.md`

---

Last Updated: 2024
