# Testing Checklist - Next.js 13 App Router

Use this checklist to verify all features of the App Router test fixture.

## Setup

- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` without errors
- [ ] Application starts on http://localhost:3000
- [ ] No console errors in browser
- [ ] TypeScript compilation successful

## Server Components

### Home Page (/)

- [ ] Page loads successfully
- [ ] View page source shows fully rendered HTML
- [ ] Check DevTools → Network → No JavaScript for page content
- [ ] Timestamp shows server-rendered time
- [ ] Navigation links are visible
- [ ] Styling is applied correctly

### About Page (/about)

- [ ] Page loads at `/about` URL
- [ ] Route group `(marketing)` doesn't appear in URL
- [ ] Marketing sidebar is visible
- [ ] Nested layout is applied
- [ ] Both root and marketing layouts are active
- [ ] Content describes route groups

### Dynamic Post (/posts/1)

- [ ] Page loads with parameter `1`
- [ ] Page title shows "Post 1 | Next.js 13 App Router"
- [ ] Loading skeleton appears briefly
- [ ] Post content renders after delay
- [ ] Try `/posts/2`, `/posts/3` - all work
- [ ] Dynamic metadata is generated correctly

## Client Components

### Dashboard (/dashboard)

- [ ] Page loads successfully
- [ ] Counter is interactive (+ and - buttons work)
- [ ] Counter state persists on button clicks
- [ ] Live clock updates every second
- [ ] Posts load from `/api/posts`
- [ ] All posts are displayed in list
- [ ] Table comparing Server vs Client shows

## Loading States

### Root Loading

- [ ] Fast navigation shows root loading UI
- [ ] Spinner appears during page load
- [ ] Loading text is visible

### Post Loading (/posts/1)

- [ ] Skeleton UI appears while loading
- [ ] Multiple skeleton elements show
- [ ] Smooth transition to actual content
- [ ] Loading takes ~1 second (simulated)

## Error Handling

### Route Error (/posts/error)

- [ ] Error boundary catches the error
- [ ] Error message displays
- [ ] "Try again" button is visible
- [ ] Clicking "Try again" attempts to reload
- [ ] Error is logged to console

### Not Found (/posts/999)

- [ ] Custom 404 page shows
- [ ] Page title is "404 - Page Not Found"
- [ ] "Go back home" link works
- [ ] Returns to home page

### Invalid Route (/invalid-route)

- [ ] Default not-found page appears
- [ ] App doesn't crash

## Route Groups

### Marketing Group

- [ ] `/about` loads without `(marketing)` in URL
- [ ] Marketing layout wraps the page
- [ ] Sidebar navigation is present
- [ ] Links in sidebar are styled
- [ ] Content area is separate from sidebar

## Parallel Routes

### Parallel Layout (/parallel)

- [ ] Main page content loads
- [ ] Team slot renders independently
- [ ] Analytics slot renders independently
- [ ] All three sections are visible
- [ ] Team members list displays (3 members)
- [ ] Analytics metrics show (4 metrics)
- [ ] Each slot has independent loading state
- [ ] Layout is responsive

## Route Handlers (API)

### GET /api/posts

- [ ] Returns JSON response
- [ ] Contains array of posts
- [ ] Each post has id, title, content
- [ ] Total count is correct
- [ ] Timestamp is included

### GET /api/posts?limit=2

- [ ] Query parameter is respected
- [ ] Returns only 2 posts
- [ ] JSON structure is correct

### POST /api/posts

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Test content"}'
```

- [ ] Returns 201 status
- [ ] New post is created
- [ ] Response includes created post
- [ ] GET /api/posts includes new post

### PATCH /api/posts

```bash
curl -X PATCH http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"id":"1","title":"Updated Title"}'
```

- [ ] Returns 200 status
- [ ] Post is updated
- [ ] Response includes updated post

### DELETE /api/posts?id=1

```bash
curl -X DELETE 'http://localhost:3000/api/posts?id=1'
```

- [ ] Returns 200 status
- [ ] Post is deleted
- [ ] Response confirms deletion
- [ ] GET /api/posts no longer includes it

### GET /api/stream

- [ ] Streaming response starts immediately
- [ ] Data arrives in chunks
- [ ] Each chunk is JSON formatted
- [ ] Total of 10 chunks received
- [ ] ~5 seconds total duration
- [ ] Content-Type is text/event-stream

## Metadata API

### Home Page

- [ ] `<title>` is "Home | Next.js 13 App Router"
- [ ] Meta description is present
- [ ] Viewport meta tag is set
- [ ] Theme color is set

### About Page

- [ ] `<title>` is "About Us | Next.js 13 App Router"
- [ ] Description is page-specific
- [ ] Keywords meta tag is present

### Post Page

- [ ] `<title>` is "Post 1 | Next.js 13 App Router"
- [ ] Description includes post ID
- [ ] Metadata is dynamically generated

### 404 Page

- [ ] `<title>` is "404 - Page Not Found"

## Layouts

### Root Layout

- [ ] Navigation header on all pages
- [ ] Footer on all pages
- [ ] Global styles applied
- [ ] Links in nav work

### Marketing Layout

- [ ] Only on marketing pages (/about)
- [ ] Sidebar is present
- [ ] Sidebar links work
- [ ] Layout is two-column grid

### Parallel Layout

- [ ] Three sections (children, team, analytics)
- [ ] Each slot receives correct content
- [ ] Layout is responsive

## Styling

### Global Styles

- [ ] app/globals.css is loaded
- [ ] Typography is consistent
- [ ] Colors are applied (primary, secondary)
- [ ] Cards have borders and shadows
- [ ] Buttons are styled
- [ ] Links have hover states

### Responsive Design

- [ ] Works on desktop (>768px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (<768px)
- [ ] Marketing layout stacks on mobile
- [ ] Parallel routes stack on mobile
- [ ] Navigation is usable on mobile

## Navigation

### Link Navigation

- [ ] Home link works
- [ ] About link works
- [ ] Post link works
- [ ] Dashboard link works
- [ ] Parallel link works

### Browser Navigation

- [ ] Back button works
- [ ] Forward button works
- [ ] Refresh preserves state
- [ ] Deep links work

## TypeScript

### Type Safety

- [ ] No TypeScript errors in `npm run dev`
- [ ] Metadata types are correct
- [ ] Route params are typed
- [ ] API responses are typed
- [ ] Props are properly typed

## Build & Production

### Development Build

```bash
npm run build
```

- [ ] Build completes without errors
- [ ] Static pages identified (○)
- [ ] SSR pages identified (ƒ)
- [ ] API routes identified (λ)
- [ ] Build output shows all routes
- [ ] No TypeScript errors

### Production Start

```bash
npm start
```

- [ ] Production server starts
- [ ] Application loads on port 3000
- [ ] All routes work in production
- [ ] Static pages load instantly
- [ ] SSR pages work correctly
- [ ] API routes function

## Performance

### Server Components

- [ ] Zero JavaScript for home page content
- [ ] Check bundle size in DevTools
- [ ] Fast initial page load
- [ ] Good Lighthouse scores

### Client Components

- [ ] JavaScript only for interactive parts
- [ ] Dashboard has JS bundle
- [ ] Other pages don't include dashboard JS
- [ ] Code splitting is working

### Loading Performance

- [ ] Instant loading UI feedback
- [ ] Smooth transitions
- [ ] No layout shifts
- [ ] Progressive rendering

## Browser Compatibility

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## Console Checks

### No Errors

- [ ] No JavaScript errors
- [ ] No TypeScript errors
- [ ] No React warnings
- [ ] No hydration mismatches

### Expected Warnings

- [ ] "Error boundary caught" when visiting /posts/error (expected)

## File Structure

### Required Files Present

- [ ] app/layout.tsx exists
- [ ] app/page.tsx exists
- [ ] package.json has correct dependencies
- [ ] next.config.js is configured
- [ ] tsconfig.json is configured

### Optional Files Work

- [ ] app/loading.tsx works
- [ ] app/error.tsx works
- [ ] app/not-found.tsx works
- [ ] app/global-error.tsx exists

## Edge Cases

### Empty States

- [ ] No posts in API still renders
- [ ] Empty parallel slots don't crash

### Invalid Inputs

- [ ] Non-numeric post ID works
- [ ] Invalid API requests return errors
- [ ] Malformed JSON returns 400

### Rapid Navigation

- [ ] Quickly clicking links doesn't break
- [ ] Loading states appear/disappear correctly
- [ ] No race conditions

## Documentation

### README Quality

- [ ] README.md is comprehensive
- [ ] Installation steps are clear
- [ ] Examples are provided
- [ ] All features are documented

### Code Comments

- [ ] Components have explanatory comments
- [ ] Complex logic is explained
- [ ] File purposes are clear

### Additional Docs

- [ ] QUICKSTART.md exists
- [ ] FIXTURE_SUMMARY.md exists
- [ ] ARCHITECTURE.md exists
- [ ] TESTING_CHECKLIST.md exists

## Advanced Features

### Streaming

- [ ] /api/stream demonstrates streaming
- [ ] Server-sent events work
- [ ] Progressive data delivery

### Parallel Routes

- [ ] Multiple slots render
- [ ] Independent loading
- [ ] Slots can have different content

### Route Groups

- [ ] (marketing) group works
- [ ] URLs don't include group name
- [ ] Can have different layouts

## Security

### Server Components

- [ ] No secrets exposed to client
- [ ] Server-only code stays on server

### API Routes

- [ ] Input validation exists
- [ ] Error messages don't leak info

## Cleanup

After testing:

- [ ] Stop dev server
- [ ] Check for any hanging processes
- [ ] Review console for final errors

## Summary

Total Checks: ~150+

### Quick Test (5 minutes)

- Visit all main routes
- Test one API endpoint
- Verify build works

### Full Test (20 minutes)

- Complete all sections
- Test all API methods
- Verify all error states
- Check production build

### Deep Test (1 hour)

- All checks above
- Performance testing
- Cross-browser testing
- Documentation review
- Code review

## Test Results Template

```
Date: __________
Tester: __________

Quick Test: Pass/Fail
Full Test: Pass/Fail
Deep Test: Pass/Fail

Issues Found:
1.
2.
3.

Notes:


```

## Automated Testing (Future)

Consider adding:

- [ ] Unit tests (Jest)
- [ ] Integration tests (React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Visual regression tests
- [ ] Performance tests (Lighthouse CI)
- [ ] API tests (Supertest)

This checklist ensures comprehensive testing of all Next.js 13 App Router features in this fixture.
