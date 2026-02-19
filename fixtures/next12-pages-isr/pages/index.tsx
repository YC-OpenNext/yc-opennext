import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Home.module.css';

interface HomeProps {
  timestamp: string;
  requestId: string;
}

/**
 * Home page with Server-Side Rendering (SSR)
 * This page is rendered on every request using getServerSideProps
 */
const Home: NextPage<HomeProps> = ({ timestamp, requestId }) => {
  return (
    <Layout>
      <Head>
        <title>Next.js 12 ISR Fixture - Home</title>
        <meta name="description" content="Next.js 12 Pages Router test fixture" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.highlight}>Next.js 12</span>
        </h1>

        <p className={styles.description}>Pages Router with Server-Side Rendering (SSR)</p>

        <div className={styles.info}>
          <p>
            <strong>Rendered at:</strong> {timestamp}
          </p>
          <p>
            <strong>Request ID:</strong> {requestId}
          </p>
          <p className={styles.note}>
            This page uses <code>getServerSideProps</code> and is rendered on every request
          </p>
        </div>

        <div className={styles.grid}>
          <Link href="/static" className={styles.card}>
            <h2>Static Page &rarr;</h2>
            <p>View a page with Static Site Generation (SSG)</p>
          </Link>

          <Link href="/isr" className={styles.card}>
            <h2>ISR Page &rarr;</h2>
            <p>View a page with Incremental Static Regeneration</p>
          </Link>

          <Link href="/blog/hello-world" className={styles.card}>
            <h2>Dynamic Route &rarr;</h2>
            <p>View a dynamic blog post with getStaticPaths</p>
          </Link>

          <Link href="/products/electronics/laptops" className={styles.card}>
            <h2>Catch-all Route &rarr;</h2>
            <p>View a catch-all route example</p>
          </Link>
        </div>

        <div className={styles.apiSection}>
          <h3>API Routes</h3>
          <ul>
            <li>
              <Link href="/api/hello">GET /api/hello</Link>
            </li>
            <li>
              <Link href="/api/users/123">GET /api/users/123</Link>
            </li>
          </ul>
        </div>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (_context) => {
  // Simulate some async operation
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    props: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(7),
    },
  };
};

export default Home;
