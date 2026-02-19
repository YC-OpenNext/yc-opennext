import type { NextApiRequest, NextApiResponse } from 'next';

type SuccessResponse = {
  revalidated: boolean;
  message: string;
  path: string;
  timestamp: string;
};

type ErrorResponse = {
  error: string;
  message?: string;
};

/**
 * On-Demand Revalidation API Route
 * Allows manual triggering of ISR revalidation for specific paths
 *
 * This is a Next.js 12.2+ feature that enables on-demand revalidation
 * without waiting for the revalidate timeout
 *
 * Usage:
 * POST /api/revalidate?path=/isr&secret=YOUR_SECRET_TOKEN
 *
 * Security Note:
 * Always use a secret token to prevent unauthorized revalidation
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: `Method ${req.method} is not allowed. Use POST.`,
    });
  }

  // Check for secret to confirm this is a valid request
  const secret = req.query.secret as string;
  const expectedSecret = process.env.REVALIDATION_SECRET || 'my-secret-token';

  if (secret !== expectedSecret) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid secret token',
    });
  }

  // Get the path to revalidate
  const path = req.query.path as string;

  if (!path) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Path parameter is required',
    });
  }

  try {
    // Revalidate the path
    // This will purge the cache for the specified path and regenerate it
    await res.revalidate(path);

    return res.status(200).json({
      revalidated: true,
      message: 'Path revalidated successfully',
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // If there was an error, Next.js will continue to show the last
    // successfully generated page
    const error = err as Error;
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Error revalidating path',
    });
  }
}

/**
 * Example usage with curl:
 *
 * curl -X POST \
 *   'http://localhost:3000/api/revalidate?path=/isr&secret=my-secret-token'
 *
 * Example usage with fetch:
 *
 * fetch('/api/revalidate?path=/isr&secret=my-secret-token', {
 *   method: 'POST',
 * })
 *   .then(res => res.json())
 *   .then(data => console.log(data));
 *
 * Paths you can revalidate in this fixture:
 * - /isr (ISR page)
 * - /blog/hello-world (Dynamic blog post)
 * - /blog/nextjs-12-features (Dynamic blog post)
 * - /blog/isr-explained (Dynamic blog post)
 * - /products/electronics (Catch-all route)
 * - /products/electronics/laptops (Catch-all route)
 */
