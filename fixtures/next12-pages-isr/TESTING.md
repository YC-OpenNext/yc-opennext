# Testing Guide for Next.js 12 ISR Fixture

This guide explains how to test all features of this Next.js 12 Pages Router fixture.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Testing Checklist

### 1. Server-Side Rendering (SSR)

**URL:** http://localhost:3000

**What to test:**

- [ ] Page loads with current timestamp
- [ ] Each refresh shows a new timestamp
- [ ] Request ID changes on each load
- [ ] Navigation links work

**Expected behavior:**

- New data on every request
- Server-side rendering (view page source to see pre-rendered HTML)

---

### 2. Static Site Generation (SSG)

**URL:** http://localhost:3000/static

**What to test:**

- [ ] Page shows build timestamp
- [ ] Timestamp doesn't change on refresh
- [ ] Fast page load (served as static HTML)

**Expected behavior:**

- Same timestamp until rebuild
- Generated once at build time

**How to verify:**

```bash
npm run build
npm start
```

Check that the build time remains constant across page refreshes.

---

### 3. Incremental Static Regeneration (ISR)

**URL:** http://localhost:3000/isr

**What to test:**

- [ ] Page shows generated timestamp
- [ ] Random data is displayed
- [ ] After 10 seconds + refresh, new data appears

**Testing steps:**

1. Visit `/isr` and note the timestamp
2. Wait 11 seconds
3. Refresh the page (you'll see the old page immediately)
4. Refresh again (you should see new data)

**Expected behavior:**

- Page regenerates in background after 10 seconds
- First request after timeout gets stale page
- Background regeneration happens
- Next request gets fresh page

---

### 4. Dynamic Routes with getStaticPaths

**URLs:**

- http://localhost:3000/blog/hello-world
- http://localhost:3000/blog/nextjs-12-features
- http://localhost:3000/blog/isr-explained

**What to test:**

- [ ] Pre-generated blog posts load instantly
- [ ] Each post shows unique content
- [ ] Navigation between posts works
- [ ] Pages regenerate after 60 seconds (ISR)
- [ ] Try a non-existent slug (e.g., `/blog/nonexistent`)

**Expected behavior:**

- Pre-generated paths load immediately
- Non-existent paths trigger 404 or on-demand generation
- ISR updates content after 60 seconds

---

### 5. Catch-all Routes

**URLs:**

- http://localhost:3000/products/electronics
- http://localhost:3000/products/electronics/laptops
- http://localhost:3000/products/electronics/laptops/gaming
- http://localhost:3000/products/clothing/shoes/running

**What to test:**

- [ ] All path segments are captured
- [ ] Breadcrumbs display correctly
- [ ] Different levels of nesting work
- [ ] Pre-generated paths vs on-demand generation

**Expected behavior:**

- Path segments shown as array
- Breadcrumbs navigation
- Pre-generated paths load fast, others generate on-demand

---

### 6. API Routes

#### Basic API Route

**URL:** http://localhost:3000/api/hello

**Test:**

```bash
curl http://localhost:3000/api/hello
```

**Expected response:**

```json
{
  "message": "Hello from Next.js 12 API Routes!",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "method": "GET",
  "headers": {
    "user-agent": "...",
    "x-forwarded-for": "..."
  }
}
```

**What to test:**

- [ ] GET request returns JSON
- [ ] Custom headers present
- [ ] Timestamp is current
- [ ] Other methods (POST, PUT) return 405

---

#### Dynamic API Route

**URL:** http://localhost:3000/api/users/123

**Test GET:**

```bash
curl http://localhost:3000/api/users/123
```

**Test PUT:**

```bash
curl -X PUT http://localhost:3000/api/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'
```

**Test DELETE:**

```bash
curl -X DELETE http://localhost:3000/api/users/123
```

**Available user IDs:** 123, 456, 789

**What to test:**

- [ ] GET returns user data
- [ ] PUT updates user (mock)
- [ ] DELETE returns 204
- [ ] Invalid ID returns 404
- [ ] Method validation works

---

#### Revalidation API

**URL:** http://localhost:3000/api/revalidate

**Test:**

```bash
curl -X POST "http://localhost:3000/api/revalidate?path=/isr&secret=my-secret-token"
```

**What to test:**

- [ ] Valid secret triggers revalidation
- [ ] Invalid secret returns 401
- [ ] Missing path returns 400
- [ ] Successful revalidation returns 200
- [ ] Page is actually revalidated

**Testing steps:**

1. Visit `/isr` and note the timestamp
2. Call revalidation API
3. Refresh `/isr` - should see new timestamp

---

### 7. Custom Error Pages

#### 404 Page

**URL:** http://localhost:3000/nonexistent

**What to test:**

- [ ] Custom 404 page appears
- [ ] Links work
- [ ] "Go Back" button works
- [ ] Proper HTTP 404 status

---

#### 500 Page

**To test 500 page:**
You'll need to cause a server error. Modify a page's `getServerSideProps` to throw:

```typescript
export const getServerSideProps = async () => {
  throw new Error('Test error');
};
```

**What to test:**

- [ ] Custom 500 page appears
- [ ] "Try Again" button works
- [ ] Proper HTTP 500 status

---

### 8. TypeScript

**What to test:**

- [ ] Run type checking: `npm run type-check`
- [ ] No TypeScript errors
- [ ] All props are properly typed
- [ ] IntelliSense works in IDE

---

### 9. Build and Production

**Build the application:**

```bash
npm run build
```

**What to check:**

- [ ] Build succeeds without errors
- [ ] SSG pages are pre-rendered
- [ ] ISR pages are generated
- [ ] Dynamic routes with `getStaticPaths` are pre-generated
- [ ] Build output shows page types (Static, SSG, ISR, SSR, API)

**Start production server:**

```bash
npm start
```

**What to test:**

- [ ] All pages work in production
- [ ] ISR revalidation works
- [ ] API routes function correctly
- [ ] Static assets load properly

---

### 10. Performance

**Tools:**

- Chrome DevTools (Network, Performance tabs)
- Lighthouse

**What to test:**

- [ ] Static pages load instantly
- [ ] No unnecessary re-renders
- [ ] Proper caching headers
- [ ] Code splitting works
- [ ] Images are optimized (if using next/image)

**Lighthouse targets:**

- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## Common Issues

### Issue: "Module not found" errors

**Solution:** Run `npm install` to install dependencies

### Issue: Port 3000 already in use

**Solution:**

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

### Issue: TypeScript errors

**Solution:**

```bash
# Check for errors
npm run type-check

# If next-env.d.ts is missing
npx next
```

### Issue: ISR not working

**Solution:**

- Ensure you're in production mode (`npm run build && npm start`)
- ISR revalidation happens in background
- First request after timeout shows stale page
- Second request shows fresh page

### Issue: API routes return 404

**Solution:**

- Check file naming: must be in `pages/api/`
- Restart dev server
- Clear `.next` cache: `rm -rf .next`

---

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

**Required variables:**

- `REVALIDATION_SECRET`: For on-demand revalidation

**Optional variables:**

- `CUSTOM_ENV_VAR`: Custom environment variable
- `API_URL`: External API URL

---

## Next Steps

After testing this fixture:

1. **Experiment with revalidate times**
   - Change `revalidate` values in `getStaticProps`
   - Test different ISR strategies

2. **Add more pages**
   - Create additional dynamic routes
   - Test nested layouts

3. **Test with real data**
   - Replace mock data with API calls
   - Test error handling

4. **Deploy**
   - Deploy to Vercel, Netlify, or other platforms
   - Test ISR in production environment

5. **Monitor performance**
   - Use analytics
   - Track Core Web Vitals
   - Monitor ISR cache hits

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Lint code
npm run type-check       # Check TypeScript

# Debugging
rm -rf .next             # Clear Next.js cache
npm ci                   # Clean install dependencies
npx next info            # Show Next.js environment info

# Testing ISR
curl -X POST "http://localhost:3000/api/revalidate?path=/isr&secret=my-secret-token"
```

---

## Documentation

- [Next.js 12 Documentation](https://nextjs.org/docs)
- [Pages Router](https://nextjs.org/docs/pages)
- [Data Fetching](https://nextjs.org/docs/basic-features/data-fetching)
- [API Routes](https://nextjs.org/docs/api-routes/introduction)
- [ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
