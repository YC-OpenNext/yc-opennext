import { Suspense } from 'react';

// Static component - renders immediately
function StaticShell() {
  return (
    <div className="card">
      <h2>
        Partial Prerendering (PPR)
        <span className="badge experimental">Experimental</span>
      </h2>
      <p>
        This page demonstrates Partial Prerendering, a Next.js 15 experimental feature that combines
        static and dynamic content in the same route. The static shell loads instantly while dynamic
        content streams in.
      </p>
    </div>
  );
}

// Dynamic component - simulates slow data fetching
async function DynamicContent() {
  // Simulate slow database query
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const data = {
    timestamp: new Date().toLocaleString(),
    randomValue: Math.floor(Math.random() * 1000),
    serverTime: Date.now(),
  };

  return (
    <div className="card">
      <h3>Dynamic Content (Streamed)</h3>
      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
        <p>
          <strong>Generated at:</strong> {data.timestamp}
        </p>
        <p>
          <strong>Random value:</strong> {data.randomValue}
        </p>
        <p>
          <strong>Server timestamp:</strong> {data.serverTime}
        </p>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6c757d' }}>
        This content was generated on the server with a 2-second delay, but the page shell loaded
        instantly.
      </p>
    </div>
  );
}

// Another dynamic component
async function UserActivity() {
  // Simulate fetching user activity
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const activities = [
    { id: 1, action: 'Logged in', time: '2 minutes ago' },
    { id: 2, action: 'Updated profile', time: '15 minutes ago' },
    { id: 3, action: 'Commented on post', time: '1 hour ago' },
  ];

  return (
    <div className="card">
      <h3>Recent Activity (Streamed)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {activities.map((activity) => (
          <div
            key={activity.id}
            style={{
              padding: '0.75rem',
              background: '#f8f9fa',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{activity.action}</span>
            <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingSkeleton({ title }: { title: string }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: '40px' }} />
        <div className="skeleton" style={{ height: '40px' }} />
        <div className="skeleton" style={{ height: '40px' }} />
      </div>
    </div>
  );
}

// Main page component
export default function PartialPage() {
  return (
    <div>
      {/* Static content - renders immediately */}
      <StaticShell />

      <div className="card">
        <h3>How PPR Works:</h3>
        <ol style={{ marginLeft: '2rem', lineHeight: '1.8' }}>
          <li>
            <strong>Static Shell:</strong> Next.js identifies static parts of your page and
            prerenders them at build time
          </li>
          <li>
            <strong>Dynamic Holes:</strong> Components wrapped in Suspense are marked as dynamic and
            filled in at request time
          </li>
          <li>
            <strong>Instant Load:</strong> Users see the static shell immediately, providing instant
            page load
          </li>
          <li>
            <strong>Progressive Enhancement:</strong> Dynamic content streams in as it becomes
            available
          </li>
          <li>
            <strong>Best of Both:</strong> Combines the speed of static sites with the flexibility
            of dynamic rendering
          </li>
        </ol>
      </div>

      {/* Dynamic content - streams in with loading states */}
      <Suspense fallback={<LoadingSkeleton title="Loading Dynamic Content..." />}>
        <DynamicContent />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton title="Loading User Activity..." />}>
        <UserActivity />
      </Suspense>

      <div className="card">
        <h3>Configuration:</h3>
        <div className="code">
          {`// next.config.js
const nextConfig = {
  experimental: {
    ppr: 'incremental', // Enable PPR
  },
};

// In your page component
export default function Page() {
  return (
    <>
      <StaticContent /> {/* Prerendered */}
      <Suspense fallback={<Loading />}>
        <DynamicContent /> {/* Streamed */}
      </Suspense>
    </>
  );
}`}
        </div>
      </div>

      <div className="card">
        <h3>Benefits of PPR:</h3>
        <div className="feature-grid">
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Instant Page Loads</h4>
            <p>Static shell loads immediately, no waiting for dynamic data</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Better SEO</h4>
            <p>Static content is immediately available to search engines</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Improved Performance</h4>
            <p>Reduces Time to First Byte and First Contentful Paint</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Simplified Architecture</h4>
            <p>No need to split static and dynamic routes</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Cost Effective</h4>
            <p>Static parts can be served from CDN, reducing server load</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Developer Experience</h4>
            <p>Write code naturally without worrying about static vs dynamic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
