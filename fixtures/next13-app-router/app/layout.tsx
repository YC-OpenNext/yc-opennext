import './globals.css';
import type { Metadata } from 'next';

// Next.js 13 Metadata API - replaces next/head in App Router
export const metadata: Metadata = {
  title: {
    default: 'Next.js 13 App Router',
    template: '%s | Next.js 13 App Router',
  },
  description: 'Comprehensive test fixture for Next.js 13 App Router features',
  keywords: ['Next.js', 'React', 'App Router', 'Server Components'],
  authors: [{ name: 'Next.js Team' }],
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <nav className="nav">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/posts/1">Post</a>
              <a href="/dashboard">Dashboard</a>
              <a href="/parallel">Parallel Routes</a>
            </nav>
          </header>
          <main className="main">{children}</main>
          <footer className="footer">
            <p>Next.js 13 App Router Test Fixture</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
