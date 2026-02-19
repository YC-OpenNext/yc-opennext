// This is a Server Component by default in App Router
// No 'use client' directive needed

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Next.js 13 App Router Home Page - Server Component',
};

// Server Components can be async
async function getData() {
  // Simulating async data fetch
  // In production, this would be a real API call or database query
  return {
    message: 'This is a Server Component',
    timestamp: new Date().toISOString(),
  };
}

export default async function HomePage() {
  const data = await getData();

  return (
    <div className="page">
      <h1>Welcome to Next.js 13 App Router</h1>

      <section className="card">
        <h2>Server Component Features</h2>
        <p>{data.message}</p>
        <p>Rendered at: {data.timestamp}</p>
        <ul>
          <li>Zero JavaScript sent to client by default</li>
          <li>Direct access to backend resources</li>
          <li>Automatic code splitting</li>
          <li>Streaming support</li>
        </ul>
      </section>

      <section className="card">
        <h2>App Router Features Demonstrated</h2>
        <ul>
          <li>Server Components (this page)</li>
          <li>Metadata API (check page title)</li>
          <li>Loading UI (visit /posts/1)</li>
          <li>Error Boundaries (visit /posts/error)</li>
          <li>Route Groups (visit /about)</li>
          <li>Route Handlers (API routes)</li>
          <li>Client Components (visit /dashboard)</li>
          <li>Parallel Routes (visit /parallel)</li>
        </ul>
      </section>

      <section className="card">
        <h2>Quick Links</h2>
        <div className="links">
          <a href="/about" className="link-button">
            About (Route Group)
          </a>
          <a href="/posts/1" className="link-button">
            Dynamic Post
          </a>
          <a href="/dashboard" className="link-button">
            Dashboard (Client)
          </a>
          <a href="/parallel" className="link-button">
            Parallel Routes
          </a>
          <a href="/api/posts" className="link-button">
            API Posts
          </a>
        </div>
      </section>
    </div>
  );
}
