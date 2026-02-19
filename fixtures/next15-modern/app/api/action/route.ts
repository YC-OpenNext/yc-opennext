import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route Handler - Next.js 15 style
 *
 * While Server Actions are preferred for most data mutations,
 * API routes are still useful for:
 * - Webhooks from external services
 * - REST API endpoints for external consumption
 * - Custom authentication flows
 * - File uploads/downloads
 */

// GET handler
export async function GET(request: NextRequest) {
  // Access search params
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  // Simulate some processing
  await new Promise((resolve) => setTimeout(resolve, 100));

  return NextResponse.json({
    message: 'API Route Handler in Next.js 15',
    query,
    timestamp: new Date().toISOString(),
    features: [
      'Type-safe request/response',
      'Built-in Web APIs (Request, Response)',
      'Streaming support',
      'Edge runtime compatible',
    ],
  });
}

// POST handler - can be used as alternative to Server Actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    if (!body.action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // Process action
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      action: body.action,
      data: body.data,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PUT handler
export async function PUT(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({
    success: true,
    message: 'Resource updated',
    data: body,
  });
}

// DELETE handler
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: `Resource ${id} deleted`,
  });
}

// PATCH handler
export async function PATCH(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({
    success: true,
    message: 'Resource partially updated',
    data: body,
  });
}
