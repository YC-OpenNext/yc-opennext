import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document component
 * Used to augment the application's <html> and <body> tags
 * This is only rendered on the server
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Custom fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Meta tags */}
        <meta name="application-name" content="Next.js 12 ISR Fixture" />
        <meta name="theme-color" content="#000000" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
