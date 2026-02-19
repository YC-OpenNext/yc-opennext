import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * On-Demand Revalidation API Route
 *
 * This endpoint allows you to manually trigger revalidation of cached pages
 * without waiting for the automatic revalidation period to expire.
 *
 * Usage:
 * POST /api/revalidate
 * Body: { "path": "/products/1" } or { "tag": "products" }
 *
 * Optional: Include a secret token for security
 * Body: { "path": "/products/1", "secret": "your-secret-token" }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, tag, secret } = body;

    // Optional: Validate secret token for security
    // In production, you should use environment variables
    if (process.env.REVALIDATION_SECRET && secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid secret token',
          message: 'Unauthorized revalidation attempt',
        },
        { status: 401 },
      );
    }

    // Revalidate by path
    if (path) {
      try {
        revalidatePath(path);
        return NextResponse.json({
          success: true,
          message: 'Path revalidated successfully',
          path,
          revalidatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error revalidating path:', error);
        return NextResponse.json(
          {
            success: false,
            error: 'Revalidation failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            path,
          },
          { status: 500 },
        );
      }
    }

    // Revalidate by tag
    if (tag) {
      try {
        revalidateTag(tag);
        return NextResponse.json({
          success: true,
          message: 'Tag revalidated successfully',
          tag,
          revalidatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error revalidating tag:', error);
        return NextResponse.json(
          {
            success: false,
            error: 'Revalidation failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            tag,
          },
          { status: 500 },
        );
      }
    }

    // No path or tag provided
    return NextResponse.json(
      {
        success: false,
        error: 'Missing parameter',
        message: 'Either "path" or "tag" must be provided',
      },
      { status: 400 },
    );
  } catch (error) {
    console.error('Error in POST /api/revalidate:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 },
    );
  }
}

// GET endpoint to display usage information
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/revalidate',
    method: 'POST',
    description: 'On-demand revalidation API for Next.js cache',
    usage: {
      revalidateByPath: {
        description: 'Revalidate a specific path',
        example: {
          path: '/products/1',
          secret: 'optional-secret-token',
        },
      },
      revalidateByTag: {
        description: 'Revalidate all pages with a specific tag',
        example: {
          tag: 'products',
          secret: 'optional-secret-token',
        },
      },
    },
    examples: [
      {
        description: 'Revalidate a product page',
        curl: 'curl -X POST http://localhost:3000/api/revalidate -H "Content-Type: application/json" -d \'{"path":"/products/1"}\'',
      },
      {
        description: 'Revalidate with secret',
        curl: 'curl -X POST http://localhost:3000/api/revalidate -H "Content-Type: application/json" -d \'{"path":"/products/1","secret":"your-secret"}\'',
      },
      {
        description: 'Revalidate by tag',
        curl: 'curl -X POST http://localhost:3000/api/revalidate -H "Content-Type: application/json" -d \'{"tag":"products"}\'',
      },
    ],
    environment: {
      REVALIDATION_SECRET: process.env.REVALIDATION_SECRET ? 'Set' : 'Not set',
    },
    timestamp: new Date().toISOString(),
  });
}
