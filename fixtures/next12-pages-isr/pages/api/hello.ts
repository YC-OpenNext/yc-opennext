import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  timestamp: string;
  method: string;
  headers?: Record<string, string | string[] | undefined>;
};

type ErrorResponse = {
  error: string;
};

/**
 * Basic API Route
 * Handles GET requests and returns a simple JSON response
 *
 * Example: GET /api/hello
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorResponse>,
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  // Set custom headers (in addition to those from next.config.js)
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');

  // Return JSON response
  res.status(200).json({
    message: 'Hello from Next.js 12 API Routes!',
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: {
      'user-agent': req.headers['user-agent'],
      'x-forwarded-for': req.headers['x-forwarded-for'],
    },
  });
}
