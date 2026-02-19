import type { NextApiRequest, NextApiResponse } from 'next';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

type ResponseData = User;

type ErrorResponse = {
  error: string;
  message?: string;
};

// Mock user database
const mockUsers: Record<string, User> = {
  '123': {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: '2023-01-15T10:00:00Z',
  },
  '456': {
    id: '456',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: '2023-02-20T14:30:00Z',
  },
  '789': {
    id: '789',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'moderator',
    createdAt: '2023-03-10T09:15:00Z',
  },
};

/**
 * Dynamic API Route
 * Handles requests to /api/users/[id]
 *
 * Examples:
 * - GET /api/users/123
 * - GET /api/users/456
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorResponse>,
) {
  const { id } = req.query;

  // Validate ID parameter
  if (!id || typeof id !== 'string') {
    res.status(400).json({
      error: 'Bad Request',
      message: 'User ID is required',
    });
    return;
  }

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return handleGet(id, res);

    case 'PUT':
      return handlePut(id, req, res);

    case 'DELETE':
      return handleDelete(id, res);

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({
        error: `Method ${req.method} Not Allowed`,
      });
  }
}

/**
 * GET /api/users/[id]
 * Retrieve a user by ID
 */
function handleGet(id: string, res: NextApiResponse<ResponseData | ErrorResponse>) {
  // Simulate database delay
  setTimeout(() => {
    const user = mockUsers[id];

    if (!user) {
      res.status(404).json({
        error: 'Not Found',
        message: `User with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json(user);
  }, 100);
}

/**
 * PUT /api/users/[id]
 * Update a user by ID
 */
function handlePut(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorResponse>,
) {
  const user = mockUsers[id];

  if (!user) {
    res.status(404).json({
      error: 'Not Found',
      message: `User with ID ${id} not found`,
    });
    return;
  }

  // In a real application, you would update the user in the database
  // For this example, we just return the user with updated timestamp
  const updatedUser: User = {
    ...user,
    ...req.body,
    id, // Prevent ID from being changed
    createdAt: user.createdAt, // Prevent createdAt from being changed
  };

  res.status(200).json(updatedUser);
}

/**
 * DELETE /api/users/[id]
 * Delete a user by ID
 */
function handleDelete(id: string, res: NextApiResponse<ResponseData | ErrorResponse>) {
  const user = mockUsers[id];

  if (!user) {
    res.status(404).json({
      error: 'Not Found',
      message: `User with ID ${id} not found`,
    });
    return;
  }

  // In a real application, you would delete the user from the database
  res.status(204).end();
}
