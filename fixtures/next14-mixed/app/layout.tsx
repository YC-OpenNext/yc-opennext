import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Next.js 14 Mixed Test App',
    template: '%s | Next.js 14 Test',
  },
  description: 'Comprehensive Next.js 14 test fixture for YC-OpenNext deployment',
  keywords: ['Next.js', 'React', 'TypeScript', 'Yandex Cloud', 'OpenNext', 'ISR', 'SSR'],
  authors: [{ name: 'YC-OpenNext Team' }],
  creator: 'YC-OpenNext',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    title: 'Next.js 14 Mixed Test App',
    description: 'Comprehensive Next.js 14 test fixture for YC-OpenNext deployment',
    siteName: 'Next.js 14 Test',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js 14 Mixed Test App',
    description: 'Comprehensive Next.js 14 test fixture for YC-OpenNext deployment',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="header">
            <nav className="nav">
              <a href="/" className="logo">
                Next.js 14 Test
              </a>
              <div className="nav-links">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/blog/first-post">Blog</a>
                <a href="/products/1">Products</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/server-action">Server Actions</a>
                <a href="/legacy">Legacy Pages</a>
              </div>
            </nav>
          </header>
          <main className="main-content">{children}</main>
          <footer className="footer">
            <p>&copy; 2024 Next.js 14 Test App - Powered by YC-OpenNext</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
