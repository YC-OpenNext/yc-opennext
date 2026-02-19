import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Home.module.css';

/**
 * Custom 404 Error Page
 * This page is shown when a route doesn't exist
 */
const Custom404: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you are looking for could not be found" />
      </Head>

      <main className={styles.main}>
        <div className={styles.errorPage}>
          <h1 className={styles.errorCode}>404</h1>
          <h2 className={styles.errorTitle}>Page Not Found</h2>
          <p className={styles.errorDescription}>
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>

          <div className={styles.errorActions}>
            <Link href="/" className={styles.button}>
              Go to Homepage
            </Link>
            <button onClick={() => window.history.back()} className={styles.buttonSecondary}>
              Go Back
            </button>
          </div>

          <div className={styles.info}>
            <h3>Helpful Links:</h3>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/static">Static Page</Link>
              </li>
              <li>
                <Link href="/isr">ISR Page</Link>
              </li>
              <li>
                <Link href="/blog/hello-world">Blog</Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Custom404;
