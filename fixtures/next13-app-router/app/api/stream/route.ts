import { NextRequest } from 'next/server';

// Streaming API Route - Next.js 13 feature
// Demonstrates server-sent events and streaming responses

export async function GET(_request: NextRequest) {
  // Create a readable stream
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    async start(controller) {
      // Send data chunks over time
      for (let i = 1; i <= 10; i++) {
        const data = {
          id: i,
          message: `Chunk ${i} of 10`,
          timestamp: new Date().toISOString(),
        };

        // Encode and send the chunk
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

        // Simulate delay between chunks
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Close the stream
      controller.close();
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

// Alternative: JSON streaming
export async function POST(request: NextRequest) {
  const body = await request.json();
  const count = body.count || 5;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode('{"items":['));

      for (let i = 0; i < count; i++) {
        if (i > 0) {
          controller.enqueue(encoder.encode(','));
        }

        const item = {
          id: i + 1,
          data: `Item ${i + 1}`,
          processed: new Date().toISOString(),
        };

        controller.enqueue(encoder.encode(JSON.stringify(item)));

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      controller.enqueue(encoder.encode(']}'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
