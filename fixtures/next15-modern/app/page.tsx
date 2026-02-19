import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Next.js 15 feature showcase homepage',
};

export default function HomePage() {
  return (
    <div>
      <div className="card">
        <h2>Welcome to Next.js 15 Modern Features</h2>
        <p>
          This fixture demonstrates the latest and greatest features in Next.js 15, including React
          19 integration, improved server actions, Turbopack, and more.
        </p>
      </div>

      <div className="feature-grid">
        <div className="card">
          <h3>
            Server Actions <span className="badge">Enhanced</span>
          </h3>
          <p>
            Improved server actions with better error handling, progressive enhancement, and
            seamless integration with React 19&apos;s useActionState hook.
          </p>
          <Link href="/form" className="button">
            Try Form Demo
          </Link>
        </div>

        <div className="card">
          <h3>
            Turbopack <span className="badge new">Stable</span>
          </h3>
          <p>
            Next.js 15 brings stable Turbopack support for development, offering significantly
            faster build times and hot module replacement.
          </p>
          <div className="code">npm run dev --turbo</div>
        </div>

        <div className="card">
          <h3>
            Partial Prerendering <span className="badge experimental">Experimental</span>
          </h3>
          <p>
            PPR allows you to combine static and dynamic content in the same route, delivering
            instant static shell while streaming dynamic content.
          </p>
          <Link href="/partial" className="button">
            View PPR Demo
          </Link>
        </div>

        <div className="card">
          <h3>
            React 19 Features <span className="badge new">New</span>
          </h3>
          <p>
            Leverage React 19&apos;s useActionState and useOptimistic hooks for better form handling
            and optimistic UI updates.
          </p>
          <Link href="/optimistic" className="button">
            See Optimistic Updates
          </Link>
        </div>

        <div className="card">
          <h3>
            Server-Only Code <span className="badge">Safe</span>
          </h3>
          <p>
            Execute expensive computations on the server without bundling them in the client,
            ensuring optimal performance and security.
          </p>
          <Link href="/server-only" className="button">
            Run Server Computation
          </Link>
        </div>

        <div className="card">
          <h3>
            Enhanced Caching <span className="badge">Improved</span>
          </h3>
          <p>
            Next.js 15 improves caching behavior with more granular control over fetch caching and
            better revalidation strategies.
          </p>
          <div className="code">revalidatePath(&apos;/path&apos;)</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Key Features in This Fixture</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>
            <strong>App Router:</strong> Full App Router implementation with layouts and nested
            routes
          </li>
          <li>
            <strong>TypeScript 5.6+:</strong> Latest TypeScript with strict mode and optimal config
          </li>
          <li>
            <strong>Server Actions:</strong> Multiple examples of server actions with validation
          </li>
          <li>
            <strong>useActionState:</strong> React 19 hook for form state management
          </li>
          <li>
            <strong>useOptimistic:</strong> Optimistic UI updates before server confirmation
          </li>
          <li>
            <strong>Metadata API:</strong> Type-safe metadata and viewport configuration
          </li>
          <li>
            <strong>Partial Prerendering:</strong> Experimental PPR support enabled
          </li>
          <li>
            <strong>Turbopack:</strong> Configured for fast development builds
          </li>
        </ul>
      </div>
    </div>
  );
}
