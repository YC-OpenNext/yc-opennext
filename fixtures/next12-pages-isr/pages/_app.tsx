import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/globals.css';

/**
 * Custom App component
 * This component is used to initialize pages and can be used to:
 * - Persist layout between page changes
 * - Keep state when navigating pages
 * - Inject additional data into pages
 * - Add global CSS
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
