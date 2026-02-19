import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About this Next.js 14 test fixture',
};

export default function AboutPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">About This Test Fixture</h1>
      <p className="page-description">
        This is a statically generated page with no dynamic data fetching
      </p>

      <div className="section">
        <h2 className="section-title">Purpose</h2>
        <div className="card">
          <p>
            This Next.js 14 test fixture is designed to comprehensively test the YC-OpenNext
            deployment system on Yandex Cloud. It demonstrates all major features and patterns used
            in modern Next.js applications.
          </p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Technology Stack</h2>
        <div className="card">
          <ul>
            <li>
              <strong>Framework:</strong> Next.js 14.2.0
            </li>
            <li>
              <strong>Runtime:</strong> React 18.2.0
            </li>
            <li>
              <strong>Language:</strong> TypeScript 5.3.3
            </li>
            <li>
              <strong>Deployment:</strong> Yandex Cloud via YC-OpenNext
            </li>
            <li>
              <strong>Build Output:</strong> Standalone mode
            </li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Rendering Strategy</h2>
        <div className="card">
          <div className="card-title">Static Generation (This Page)</div>
          <p className="card-description">
            This page is statically generated at build time. It has no dynamic data and will be
            served as a static HTML file, making it extremely fast to load.
          </p>
          <span className="badge">Static</span>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Features Demonstrated</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          <div className="card">
            <div className="card-title">App Router</div>
            <p className="card-description">Modern file-system based routing with app directory</p>
          </div>

          <div className="card">
            <div className="card-title">Server Components</div>
            <p className="card-description">React Server Components for improved performance</p>
          </div>

          <div className="card">
            <div className="card-title">Client Components</div>
            <p className="card-description">
              Interactive UI components with client-side JavaScript
            </p>
          </div>

          <div className="card">
            <div className="card-title">API Routes</div>
            <p className="card-description">Both App Router and Pages Router API endpoints</p>
          </div>

          <div className="card">
            <div className="card-title">ISR</div>
            <p className="card-description">
              Incremental Static Regeneration with time-based revalidation
            </p>
          </div>

          <div className="card">
            <div className="card-title">Server Actions</div>
            <p className="card-description">Form handling without dedicated API routes</p>
          </div>

          <div className="card">
            <div className="card-title">Middleware</div>
            <p className="card-description">Request/response manipulation at the edge</p>
          </div>

          <div className="card">
            <div className="card-title">TypeScript</div>
            <p className="card-description">Full type safety across the application</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Test Coverage</h2>
        <div className="card">
          <p>This fixture tests:</p>
          <ul>
            <li>Static page generation (this page)</li>
            <li>Server-side rendering (home page)</li>
            <li>Dynamic routes with parameters (blog, products)</li>
            <li>ISR with automatic revalidation (products)</li>
            <li>On-demand revalidation via API</li>
            <li>Client-side rendering (dashboard)</li>
            <li>Server actions (forms)</li>
            <li>Pages Router compatibility (legacy)</li>
            <li>API routes in both routers</li>
            <li>Middleware for headers and redirects</li>
            <li>Image optimization configuration</li>
            <li>Custom headers and CORS</li>
            <li>Redirects and rewrites</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <a href="/" className="button">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
