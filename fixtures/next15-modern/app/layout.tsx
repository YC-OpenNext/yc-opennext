import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';

// Viewport configuration (separated from metadata in Next.js 15)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Next.js 15 Modern Features',
    template: '%s | Next.js 15',
  },
  description: 'Showcase of Next.js 15 features including server actions, PPR, and Turbopack',
  keywords: ['Next.js', 'React 19', 'Server Actions', 'Turbopack', 'PPR'],
  authors: [{ name: 'Next.js Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Next.js 15 Modern',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <h1>Next.js 15 Features</h1>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a href="/form">Form with useActionState</a>
            </li>
            <li>
              <a href="/optimistic">Optimistic Updates</a>
            </li>
            <li>
              <a href="/server-only">Server-Only Code</a>
            </li>
            <li>
              <a href="/partial">Partial Prerendering</a>
            </li>
          </ul>
        </nav>
        <main className="main">{children}</main>
        <footer className="footer">
          <p>Built with Next.js 15 + React 19 + Turbopack</p>
        </footer>
      </body>
    </html>
  );
}
