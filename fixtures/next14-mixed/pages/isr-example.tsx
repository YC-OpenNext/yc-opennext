import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

/**
 * ISR Example (Pages Router)
 *
 * This demonstrates Incremental Static Regeneration using the traditional
 * getStaticProps method from the Pages Router.
 */

interface PageProps {
  generatedAt: string;
  randomNumber: number;
  quote: string;
  views: number;
}

// Revalidate every 30 seconds
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  // Simulate data fetching
  const quotes = [
    'The best way to predict the future is to invent it.',
    "Code is like humor. When you have to explain it, it's bad.",
    'First, solve the problem. Then, write the code.',
    'Experience is the name everyone gives to their mistakes.',
    'In order to be irreplaceable, one must always be different.',
    'Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.',
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return {
    props: {
      generatedAt: new Date().toISOString(),
      randomNumber: Math.floor(Math.random() * 10000),
      quote: randomQuote,
      views: Math.floor(Math.random() * 1000) + 100,
    },
    // Revalidate every 30 seconds
    revalidate: 30,
  };
};

export default function ISRExamplePage({ generatedAt, randomNumber, quote, views }: PageProps) {
  return (
    <>
      <Head>
        <title>ISR Example | Next.js 14 Test</title>
        <meta name="description" content="ISR example using getStaticProps in Pages Router" />
      </Head>

      <div className="page-container">
        <div className="section">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span className="badge success">ISR - 30s</span>
            <span className="badge warning">Pages Router</span>
          </div>
          <h1 className="page-title">ISR Example (Pages Router)</h1>
          <p className="page-description">This page uses getStaticProps with revalidate for ISR</p>
        </div>

        <div className="section">
          <div className="card">
            <h3 className="card-title">What is ISR?</h3>
            <p className="card-description">
              Incremental Static Regeneration (ISR) allows you to create or update static pages
              after you've built your site. It combines the benefits of static generation with the
              flexibility of server-side rendering.
            </p>

            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>How it works:</h4>
              <ol style={{ marginLeft: '1.5rem' }}>
                <li>The page is generated statically at build time</li>
                <li>Served from cache for fast initial loads</li>
                <li>
                  After the revalidation period (30s here), Next.js regenerates the page in the
                  background
                </li>
                <li>Subsequent requests get the updated page</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Dynamic Data</h2>
          <div className="card">
            <p className="card-description">
              This data was generated using getStaticProps with a 30-second revalidation period:
            </p>

            <div
              style={{
                marginTop: '1rem',
                padding: '1.5rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                border: '2px solid #e5e7eb',
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <strong>Generated At:</strong>
                <div style={{ fontSize: '1.125rem', color: '#2563eb', marginTop: '0.25rem' }}>
                  {new Date(generatedAt).toLocaleString()}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Random Number:</strong>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#059669',
                    marginTop: '0.25rem',
                  }}
                >
                  {randomNumber}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong>Quote of the Moment:</strong>
                <div
                  style={{
                    fontSize: '1.125rem',
                    fontStyle: 'italic',
                    color: '#6b7280',
                    marginTop: '0.5rem',
                    padding: '1rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '0.5rem',
                    borderLeft: '4px solid #2563eb',
                  }}
                >
                  "{quote}"
                </div>
              </div>

              <div>
                <strong>Page Views (simulated):</strong>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#7c3aed',
                    marginTop: '0.25rem',
                  }}
                >
                  {views.toLocaleString()}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
              }}
            >
              <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                <strong>Try this:</strong> Refresh this page multiple times within 30 seconds.
                You'll see the same data. Wait 30+ seconds, then refresh again to see updated data.
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Pages Router vs App Router ISR</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            <div className="card">
              <div className="card-title">Pages Router (This Page)</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Method:</strong> getStaticProps
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>File:</strong> /pages/isr-example.tsx
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Revalidation:</strong> revalidate: 30
                </p>
                <pre style={{ marginTop: '1rem', fontSize: '0.75rem' }}>
                  <code>{`export const getStaticProps = {
  props: { ... },
  revalidate: 30
}`}</code>
                </pre>
              </div>
            </div>

            <div className="card">
              <div className="card-title">App Router</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Method:</strong> export const revalidate
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>File:</strong> /app/products/[id]/page.tsx
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Revalidation:</strong> export const revalidate = 60
                </p>
                <pre style={{ marginTop: '1rem', fontSize: '0.75rem' }}>
                  <code>{`export const revalidate = 60

export default async function() {
  // component code
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="card">
            <h3 className="card-title">ISR Benefits</h3>
            <ul style={{ marginTop: '1rem', marginLeft: '1.5rem' }}>
              <li>
                <strong>Performance:</strong> Fast initial page loads from static generation
              </li>
              <li>
                <strong>Fresh Content:</strong> Automatic updates without manual rebuilds
              </li>
              <li>
                <strong>Scalability:</strong> Cached pages reduce server load
              </li>
              <li>
                <strong>Cost Effective:</strong> Less compute time than pure SSR
              </li>
              <li>
                <strong>SEO Friendly:</strong> Pre-rendered HTML for search engines
              </li>
              <li>
                <strong>Flexibility:</strong> Control revalidation frequency per page
              </li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">On-Demand Revalidation</h2>
          <div className="card">
            <p className="card-description">
              You can also trigger revalidation manually using the revalidation API:
            </p>
            <pre style={{ marginTop: '1rem' }}>
              <code>{`POST /api/revalidate
{
  "path": "/isr-example"
}`}</code>
            </pre>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
              This will immediately regenerate the page without waiting for the 30-second interval.
            </p>
          </div>
        </div>

        <div className="section">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/" className="button">
              Back to Home
            </Link>
            <Link href="/products/1" className="button">
              View App Router ISR Example
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
