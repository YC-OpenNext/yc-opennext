import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Home.module.css';

interface StaticPageProps {
  buildTime: string;
  environmentVar: string;
}

/**
 * Static page with Static Site Generation (SSG)
 * This page is generated at build time and served as static HTML
 */
const StaticPage: NextPage<StaticPageProps> = ({ buildTime, environmentVar }) => {
  return (
    <Layout>
      <Head>
        <title>Static Page - Next.js 12 Fixture</title>
        <meta name="description" content="Statically generated page at build time" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Static Site Generation (SSG)</h1>

        <p className={styles.description}>This page is generated once at build time</p>

        <div className={styles.info}>
          <p>
            <strong>Built at:</strong> {buildTime}
          </p>
          <p>
            <strong>Environment:</strong> {environmentVar}
          </p>
          <p className={styles.note}>
            This page uses <code>getStaticProps</code> and is generated at build time. The timestamp
            will not change until you rebuild the application.
          </p>
        </div>

        <div className={styles.features}>
          <h2>SSG Benefits:</h2>
          <ul>
            <li>Fastest possible performance - served as static HTML</li>
            <li>No server-side processing on each request</li>
            <li>Can be cached by CDN</li>
            <li>Perfect for content that doesn&apos;t change frequently</li>
          </ul>
        </div>

        <div className={styles.navigation}>
          <Link href="/" className={styles.backLink}>
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<StaticPageProps> = async () => {
  // This runs at build time in production
  return {
    props: {
      buildTime: new Date().toISOString(),
      environmentVar: process.env.CUSTOM_ENV_VAR || 'default',
    },
  };
};

export default StaticPage;
