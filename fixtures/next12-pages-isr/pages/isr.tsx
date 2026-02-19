import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Home.module.css';

interface ISRPageProps {
  generatedAt: string;
  randomData: {
    id: string;
    value: number;
  };
  revalidateSeconds: number;
}

/**
 * ISR (Incremental Static Regeneration) page
 * This page is statically generated but can be regenerated in the background
 * after the revalidation period expires
 */
const ISRPage: NextPage<ISRPageProps> = ({ generatedAt, randomData, revalidateSeconds }) => {
  return (
    <Layout>
      <Head>
        <title>ISR Page - Next.js 12 Fixture</title>
        <meta name="description" content="Incremental Static Regeneration example" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Incremental Static Regeneration (ISR)</h1>

        <p className={styles.description}>
          This page regenerates every {revalidateSeconds} seconds
        </p>

        <div className={styles.info}>
          <p>
            <strong>Generated at:</strong> {generatedAt}
          </p>
          <p>
            <strong>Random ID:</strong> {randomData.id}
          </p>
          <p>
            <strong>Random Value:</strong> {randomData.value}
          </p>
          <p className={styles.note}>
            This page uses <code>getStaticProps</code> with{' '}
            <code>revalidate: {revalidateSeconds}</code>. After {revalidateSeconds} seconds, the
            next request will trigger a regeneration in the background.
          </p>
        </div>

        <div className={styles.features}>
          <h2>ISR Benefits:</h2>
          <ul>
            <li>Static generation performance with dynamic content</li>
            <li>Updates happen automatically in the background</li>
            <li>Old pages are served until new ones are generated</li>
            <li>No need to rebuild the entire site for content updates</li>
          </ul>

          <h2>How it works:</h2>
          <ol>
            <li>Page is statically generated at build time</li>
            <li>After {revalidateSeconds} seconds, the page becomes &quot;stale&quot;</li>
            <li>Next request gets the stale page immediately</li>
            <li>Regeneration happens in the background</li>
            <li>New page replaces the old one once ready</li>
          </ol>
        </div>

        <div className={styles.apiSection}>
          <h3>On-Demand Revalidation</h3>
          <p>You can also trigger revalidation manually using the revalidation API:</p>
          <code className={styles.code}>POST /api/revalidate?path=/isr&secret=YOUR_SECRET</code>
        </div>

        <div className={styles.navigation}>
          <button onClick={() => window.location.reload()} className={styles.button}>
            Refresh Page
          </button>
          <Link href="/" className={styles.backLink}>
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<ISRPageProps> = async () => {
  // Simulate fetching data from an API
  await new Promise((resolve) => setTimeout(resolve, 100));

  const revalidateSeconds = 10;

  return {
    props: {
      generatedAt: new Date().toISOString(),
      randomData: {
        id: Math.random().toString(36).substring(7),
        value: Math.floor(Math.random() * 1000),
      },
      revalidateSeconds,
    },
    // Revalidate every 10 seconds
    revalidate: revalidateSeconds,
  };
};

export default ISRPage;
