import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Next.js 14 comprehensive test fixture for YC-OpenNext',
};

async function getServerData() {
  // Simulate server-side data fetching
  const timestamp = new Date().toISOString();
  const randomId = Math.floor(Math.random() * 10000);

  // In a real app, this would be an API call or database query
  return {
    timestamp,
    randomId,
    environment: process.env.NODE_ENV,
    message: 'This data was fetched on the server at request time (SSR)',
  };
}

export default async function Home() {
  const serverData = await getServerData();

  return (
    <div className="page-container">
      <h1 className="page-title">Next.js 14 on Yandex Cloud</h1>
      <p className="page-description">
        Comprehensive test fixture for YC-OpenNext demonstrating all major Next.js 14 features
      </p>

      <div className="section">
        <h2 className="section-title">Server-Side Rendering (SSR)</h2>
        <div className="card">
          <h3 className="card-title">Server Data</h3>
          <p className="card-description">
            This page is rendered on the server for each request. The data below is fetched fresh on
            every page load:
          </p>
          <pre>
            <code>{JSON.stringify(serverData, null, 2)}</code>
          </pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Features Tested</h2>
        <div className="card">
          <ul>
            <li>
              <strong>App Router</strong> - Using the new app directory structure
            </li>
            <li>
              <strong>Server Components</strong> - Default server-side rendering
            </li>
            <li>
              <strong>Client Components</strong> - Interactive UI with 'use client'
            </li>
            <li>
              <strong>API Routes</strong> - Both App Router and Pages Router APIs
            </li>
            <li>
              <strong>ISR (Incremental Static Regeneration)</strong> - Time-based revalidation
            </li>
            <li>
              <strong>On-Demand Revalidation</strong> - Manual cache invalidation
            </li>
            <li>
              <strong>Dynamic Routes</strong> - Parameterized pages
            </li>
            <li>
              <strong>Static Generation</strong> - Pre-rendered pages
            </li>
            <li>
              <strong>Server Actions</strong> - Form submissions without API routes
            </li>
            <li>
              <strong>Middleware</strong> - Request/response manipulation
            </li>
            <li>
              <strong>Image Optimization</strong> - Next.js Image component
            </li>
            <li>
              <strong>TypeScript</strong> - Full type safety
            </li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Test Pages</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          <div className="card">
            <h3 className="card-title">
              <a href="/about">About Page</a>
            </h3>
            <p className="card-description">Static page with no data fetching</p>
            <span className="badge">Static</span>
          </div>

          <div className="card">
            <h3 className="card-title">
              <a href="/blog/first-post">Blog Post</a>
            </h3>
            <p className="card-description">Dynamic SSR page with URL parameters</p>
            <span className="badge">SSR</span>
          </div>

          <div className="card">
            <h3 className="card-title">
              <a href="/products/1">Product Page</a>
            </h3>
            <p className="card-description">ISR page with 60-second revalidation</p>
            <span className="badge success">ISR</span>
          </div>

          <div className="card">
            <h3 className="card-title">
              <a href="/dashboard">Dashboard</a>
            </h3>
            <p className="card-description">Client-side rendered interactive page</p>
            <span className="badge warning">Client</span>
          </div>

          <div className="card">
            <h3 className="card-title">
              <a href="/server-action">Server Actions</a>
            </h3>
            <p className="card-description">Form handling with server actions</p>
            <span className="badge">Server Action</span>
          </div>

          <div className="card">
            <h3 className="card-title">
              <a href="/legacy">Legacy Pages Router</a>
            </h3>
            <p className="card-description">Pages directory compatibility test</p>
            <span className="badge warning">Pages Router</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">API Routes</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          <div className="card">
            <h3 className="card-title">
              <a href="/api/hello">/api/hello</a>
            </h3>
            <p className="card-description">Basic API route with GET and POST</p>
          </div>

          <div className="card">
            <h3 className="card-title">
              <a href="/api/products">/api/products</a>
            </h3>
            <p className="card-description">Products API returning JSON data</p>
          </div>

          <div className="card">
            <h3 className="card-title">
              <code>/api/revalidate</code>
            </h3>
            <p className="card-description">On-demand revalidation endpoint</p>
          </div>

          <div className="card">
            <h3 className="card-title">
              <a href="/api/legacy">/api/legacy</a>
            </h3>
            <p className="card-description">Pages Router API route</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Environment Information</h2>
        <div className="card">
          <ul>
            <li>
              <strong>Node Environment:</strong> {process.env.NODE_ENV}
            </li>
            <li>
              <strong>Next.js Version:</strong> 14.2.0
            </li>
            <li>
              <strong>React Version:</strong> 18.2.0
            </li>
            <li>
              <strong>Deployment Target:</strong> Yandex Cloud
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
