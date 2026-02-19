import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Next.js 14
 *
 * Middleware runs before a request is completed. It can:
 * - Rewrite, redirect, add headers
 * - Read and set cookies
 * - Implement authentication/authorization
 * - Add custom headers
 * - Handle A/B testing
 * - Implement rate limiting
 * - Log requests
 */

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const url = `${pathname}${search}`;

  // Clone the response
  const response = NextResponse.next();

  // Add custom headers to all responses
  response.headers.set('X-Middleware-Version', '1.0');
  response.headers.set('X-Request-Path', pathname);
  response.headers.set('X-Request-Time', new Date().toISOString());

  // Logging (in production, you'd send this to a logging service)
  console.log(`[Middleware] ${request.method} ${url}`);

  // Example: Redirect old URLs
  if (pathname === '/old-about') {
    return NextResponse.redirect(new URL('/about', request.url));
  }

  // Example: Add custom header for specific paths
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-API-Version', 'v1');
    response.headers.set('X-API-Route', pathname);
  }

  // Example: Add custom header for blog posts
  if (pathname.startsWith('/blog/')) {
    response.headers.set('X-Content-Type', 'blog-post');
  }

  // Example: Add custom header for products (ISR pages)
  if (pathname.startsWith('/products/')) {
    response.headers.set('X-Content-Type', 'product-page');
    response.headers.set('X-Cache-Strategy', 'ISR');
  }

  // Example: Implement a simple feature flag
  const featureFlag = request.cookies.get('feature-new-ui');
  if (featureFlag?.value === 'enabled' && pathname === '/dashboard') {
    response.headers.set('X-Feature-New-UI', 'enabled');
  }

  // Example: Add security headers for all pages
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Example: Implement simple rate limiting (in-memory, for demo only)
  // In production, use a proper rate limiting solution with Redis
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  response.headers.set('X-Client-IP', clientIP);

  // Example: Add custom header based on user agent
  const userAgent = request.headers.get('user-agent') || '';
  if (userAgent.includes('Mobile')) {
    response.headers.set('X-Device-Type', 'mobile');
  } else if (userAgent.includes('Tablet')) {
    response.headers.set('X-Device-Type', 'tablet');
  } else {
    response.headers.set('X-Device-Type', 'desktop');
  }

  // Example: Set a custom cookie
  if (!request.cookies.get('session-id')) {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    response.cookies.set('session-id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  // Example: Rewrite for A/B testing (commented out)
  // const bucket = Math.random() > 0.5 ? 'a' : 'b'
  // if (pathname === '/experiment') {
  //   return NextResponse.rewrite(new URL(`/experiment-${bucket}`, request.url))
  // }

  return response;
}

/**
 * Matcher configuration
 *
 * Specifies which paths the middleware should run on.
 * This is more efficient than running on all paths.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
