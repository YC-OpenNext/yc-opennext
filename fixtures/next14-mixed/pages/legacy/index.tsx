import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

/**
 * Legacy Pages Router Example
 *
 * This demonstrates the traditional Pages Router that exists alongside
 * the new App Router in Next.js 14. Both routers can coexist in the same app.
 */

interface PageProps {
  timestamp: string;
  userAgent: string;
  host: string;
  path: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  // Server-side data fetching using getServerSideProps
  const { req } = context;

  return {
    props: {
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'Unknown',
      host: req.headers.host || 'Unknown',
      path: req.url || 'Unknown',
    },
  };
};

export default function LegacyPage({ timestamp, userAgent, host, path }: PageProps) {
  return (
    <>
      <Head>
        <title>Legacy Pages Router | Next.js 14 Test</title>
        <meta name="description" content="Pages Router example in Next.js 14" />
      </Head>

      <div className="page-container">
        <div className="section">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span className="badge warning">Pages Router</span>
            <span className="badge">SSR</span>
          </div>
          <h1 className="page-title">Legacy Pages Router</h1>
          <p className="page-description">
            This page uses the traditional Pages Router with getServerSideProps
          </p>
        </div>

        <div className="section">
          <div className="card">
            <h3 className="card-title">Pages Router vs App Router</h3>
            <p className="card-description">
              Next.js 14 supports both the new App Router and the traditional Pages Router. They can
              coexist in the same application, allowing for gradual migration.
            </p>

            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Pages Router Features:</h4>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li>Traditional file-based routing in /pages directory</li>
                <li>getServerSideProps for SSR</li>
                <li>getStaticProps for SSG</li>
                <li>getStaticPaths for dynamic routes</li>
                <li>API routes in /pages/api</li>
                <li>Familiar patterns from Next.js 12 and earlier</li>
              </ul>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>App Router Features:</h4>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li>Modern routing in /app directory</li>
                <li>React Server Components by default</li>
                <li>Streaming and Suspense support</li>
                <li>Improved layouts and templates</li>
                <li>Server Actions for mutations</li>
                <li>Better performance and flexibility</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Server-Side Props Data</h2>
          <div className="card">
            <p className="card-description">
              This data was fetched using getServerSideProps, the traditional SSR method in the
              Pages Router:
            </p>
            <pre>
              <code>
                {JSON.stringify(
                  {
                    timestamp,
                    userAgent: userAgent.substring(0, 100) + '...',
                    host,
                    path,
                  },
                  null,
                  2,
                )}
              </code>
            </pre>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">File Location</h2>
          <div className="card">
            <p className="card-description">This page is located at:</p>
            <code
              style={{
                display: 'block',
                marginTop: '0.5rem',
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem',
              }}
            >
              /pages/legacy/index.tsx
            </code>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
              In contrast, App Router pages are in the /app directory with a page.tsx file.
            </p>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Navigation</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            <div className="card">
              <h3 className="card-title">App Router Pages</h3>
              <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>
                  <Link href="/">Home (App Router)</Link>
                </li>
                <li>
                  <Link href="/about">About (App Router)</Link>
                </li>
                <li>
                  <Link href="/blog/first-post">Blog (App Router)</Link>
                </li>
                <li>
                  <Link href="/products/1">Products (App Router)</Link>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="card-title">Pages Router</h3>
              <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>
                  <Link href="/legacy">Legacy Page (this page)</Link>
                </li>
                <li>
                  <Link href="/isr-example">ISR Example</Link>
                </li>
                <li>
                  <Link href="/api/legacy">Legacy API Route</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="card">
            <h3 className="card-title">Migration Path</h3>
            <p className="card-description">When migrating from Pages Router to App Router:</p>
            <ol style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
              <li>Both routers can coexist during migration</li>
              <li>The App Router takes precedence when routes conflict</li>
              <li>API routes can remain in /pages/api</li>
              <li>Migrate incrementally, page by page</li>
              <li>Test thoroughly as you migrate</li>
            </ol>
          </div>
        </div>

        <div className="section">
          <Link href="/" className="button">
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
