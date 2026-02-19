import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Home.module.css';

/**
 * Custom 500 Error Page
 * This page is shown when a server-side error occurs
 */
const Custom500: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>500 - Server Error</title>
        <meta name="description" content="An internal server error occurred" />
      </Head>

      <main className={styles.main}>
        <div className={styles.errorPage}>
          <h1 className={styles.errorCode}>500</h1>
          <h2 className={styles.errorTitle}>Server Error</h2>
          <p className={styles.errorDescription}>
            Oops! Something went wrong on our end. We&apos;re working to fix it.
          </p>

          <div className={styles.errorActions}>
            <Link href="/" className={styles.button}>
              Go to Homepage
            </Link>
            <button onClick={() => window.location.reload()} className={styles.buttonSecondary}>
              Try Again
            </button>
          </div>

          <div className={styles.info}>
            <p className={styles.note}>If this problem persists, please contact support.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Custom500;
