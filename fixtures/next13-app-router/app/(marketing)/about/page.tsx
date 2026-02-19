import { Metadata } from 'next';

// Route Groups: (marketing) doesn't appear in URL
// This page is accessible at /about, not /(marketing)/about

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our Next.js 13 App Router implementation',
};

export default function AboutPage() {
  return (
    <div className="page">
      <h1>About Us</h1>

      <section className="card">
        <h2>Route Groups Feature</h2>
        <p>
          This page is inside the <code>(marketing)</code> route group, but accessible at{' '}
          <code>/about</code>.
        </p>
        <p>Route groups allow you to:</p>
        <ul>
          <li>Organize routes without affecting URL structure</li>
          <li>Create multiple root layouts</li>
          <li>Split your application into sections</li>
          <li>Apply different layouts to different route groups</li>
        </ul>
      </section>

      <section className="card">
        <h2>Nested Layouts</h2>
        <p>
          This page uses both the root layout and the marketing layout, demonstrating Next.js 13's
          layout nesting capability.
        </p>
      </section>

      <section className="card">
        <h2>Next.js 13 Benefits</h2>
        <ul>
          <li>Improved performance with Server Components</li>
          <li>Better developer experience with file-based routing</li>
          <li>Built-in loading and error states</li>
          <li>Simplified data fetching</li>
          <li>TypeScript-first approach</li>
        </ul>
      </section>
    </div>
  );
}
