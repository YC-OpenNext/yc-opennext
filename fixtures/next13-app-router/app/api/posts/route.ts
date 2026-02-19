import { NextRequest, NextResponse } from 'next/server';

// Route Handlers - New API Routes in Next.js 13 App Router
// Replace pages/api/* in the Pages Router

// Sample posts data
const posts = [
  { id: '1', title: 'First Post', content: 'This is the first post' },
  { id: '2', title: 'Second Post', content: 'This is the second post' },
  { id: '3', title: 'Third Post', content: 'This is the third post' },
];

// GET /api/posts
export async function GET(request: NextRequest) {
  // Access query parameters
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');

  let data = posts;

  if (limit) {
    data = posts.slice(0, parseInt(limit));
  }

  return NextResponse.json({
    posts: data,
    total: data.length,
    timestamp: new Date().toISOString(),
  });
}

// POST /api/posts
export async function POST(request: NextRequest) {
  const body = await request.json();

  const newPost = {
    id: String(posts.length + 1),
    title: body.title || 'Untitled',
    content: body.content || '',
  };

  posts.push(newPost);

  return NextResponse.json(
    {
      message: 'Post created successfully',
      post: newPost,
    },
    { status: 201 },
  );
}

// PATCH /api/posts
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  posts[postIndex] = { ...posts[postIndex], ...updates };

  return NextResponse.json({
    message: 'Post updated successfully',
    post: posts[postIndex],
  });
}

// DELETE /api/posts
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const deletedPost = posts.splice(postIndex, 1)[0];

  return NextResponse.json({
    message: 'Post deleted successfully',
    post: deletedPost,
  });
}
