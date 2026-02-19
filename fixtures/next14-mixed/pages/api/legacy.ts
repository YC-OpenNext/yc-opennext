import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Legacy API Route (Pages Router)
 *
 * This demonstrates the traditional API route format from the Pages Router.
 * It uses NextApiRequest and NextApiResponse types and runs in /pages/api.
 */

type ResponseData = {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp: string;
  method: string;
  query?: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { method } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  // Handle OPTIONS request for CORS
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      case 'PUT':
        return handlePut(req, res);
      case 'DELETE':
        return handleDelete(req, res);
      default:
        return res.status(405).json({
          success: false,
          message: 'Method not allowed',
          error: `Method ${method} is not supported`,
          timestamp: new Date().toISOString(),
          method: method || 'UNKNOWN',
        });
    }
  } catch (error) {
    console.error('Error in legacy API route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      method: method || 'UNKNOWN',
    });
  }
}

function handleGet(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { query } = req;
  const id = query.id as string | undefined;

  return res.status(200).json({
    success: true,
    message: 'GET request successful',
    data: {
      description: 'This is a legacy Pages Router API route',
      location: '/pages/api/legacy.ts',
      features: [
        'Traditional API route format',
        'NextApiRequest and NextApiResponse',
        'Can coexist with App Router API routes',
        'Supports all HTTP methods',
        'Compatible with Next.js middleware',
      ],
      query: query,
      id: id || null,
    },
    timestamp: new Date().toISOString(),
    method: 'GET',
    query: query,
  });
}

function handlePost(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { body } = req;

  // Validate request body
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body',
      error: 'Request body must be a valid JSON object',
      timestamp: new Date().toISOString(),
      method: 'POST',
    });
  }

  return res.status(201).json({
    success: true,
    message: 'POST request successful',
    data: {
      received: body,
      processed: true,
      createdAt: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
    method: 'POST',
  });
}

function handlePut(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { body, query } = req;
  const id = query.id as string | undefined;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Missing ID parameter',
      error: 'ID is required for PUT requests',
      timestamp: new Date().toISOString(),
      method: 'PUT',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'PUT request successful',
    data: {
      id,
      updated: body,
      updatedAt: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
    method: 'PUT',
  });
}

function handleDelete(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { query } = req;
  const id = query.id as string | undefined;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Missing ID parameter',
      error: 'ID is required for DELETE requests',
      timestamp: new Date().toISOString(),
      method: 'DELETE',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'DELETE request successful',
    data: {
      id,
      deleted: true,
      deletedAt: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
    method: 'DELETE',
  });
}
