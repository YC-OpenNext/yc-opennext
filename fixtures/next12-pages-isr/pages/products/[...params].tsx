import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import styles from '@/styles/Home.module.css';

interface CatchAllPageProps {
  params: string[];
  breadcrumbs: string[];
  generatedAt: string;
}

/**
 * Catch-all route example
 * Matches /products/[slug], /products/[slug]/[slug], etc.
 * The params are available as an array in the params object
 */
const CatchAllPage: NextPage<CatchAllPageProps> = ({ params, breadcrumbs, generatedAt }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className={styles.main}>
          <h1>Loading...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Products: {params.join(' > ')} - Next.js 12 Fixture</title>
        <meta name="description" content={`Browse ${params.join(' > ')}`} />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Catch-all Route Example</h1>

        <p className={styles.description}>
          This demonstrates Next.js catch-all routes with <code>[...params]</code>
        </p>

        <div className={styles.info}>
          <h2>Current Path:</h2>
          <p className={styles.path}>/products/{params.join('/')}</p>

          <h2>Breadcrumbs:</h2>
          <nav className={styles.breadcrumbs}>
            {breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {index > 0 && ' > '}
                <span className={styles.breadcrumb}>{crumb}</span>
              </span>
            ))}
          </nav>

          <h2>Parameters:</h2>
          <ul>
            {params.map((param, index) => (
              <li key={index}>
                <strong>params[{index}]:</strong> {param}
              </li>
            ))}
          </ul>

          <p>
            <strong>Generated at:</strong> {new Date(generatedAt).toLocaleString()}
          </p>

          <p className={styles.note}>
            Catch-all routes capture all segments after the base path. This is useful for creating
            flexible routing structures like product categories, documentation paths, or file
            browsers.
          </p>
        </div>

        <div className={styles.features}>
          <h2>How Catch-all Routes Work:</h2>
          <ul>
            <li>
              <code>[...params].tsx</code> matches any number of segments
            </li>
            <li>
              Segments are available as an array in <code>params.params</code>
            </li>
            <li>
              Can be combined with <code>getStaticPaths</code> and <code>getStaticProps</code>
            </li>
            <li>
              Use <code>fallback: &apos;blocking&apos;</code> for on-demand generation
            </li>
          </ul>
        </div>

        <div className={styles.navigation}>
          <h3>Try these paths:</h3>
          <ul>
            <li>
              <Link href="/products/electronics">/products/electronics</Link>
            </li>
            <li>
              <Link href="/products/electronics/laptops">/products/electronics/laptops</Link>
            </li>
            <li>
              <Link href="/products/electronics/laptops/gaming">
                /products/electronics/laptops/gaming
              </Link>
            </li>
            <li>
              <Link href="/products/clothing/shoes/running">/products/clothing/shoes/running</Link>
            </li>
          </ul>

          <Link href="/" className={styles.backLink}>
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Pre-generate some common product paths
  const paths = [
    { params: { params: ['electronics'] } },
    { params: { params: ['electronics', 'laptops'] } },
    { params: { params: ['electronics', 'phones'] } },
    { params: { params: ['clothing', 'shoes'] } },
  ];

  return {
    paths,
    // Use 'blocking' fallback to generate other paths on-demand
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<CatchAllPageProps> = async ({ params }) => {
  const urlParams = params?.params as string[];

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Create breadcrumbs
  const breadcrumbs = ['Products', ...urlParams];

  return {
    props: {
      params: urlParams,
      breadcrumbs,
      generatedAt: new Date().toISOString(),
    },
    revalidate: 30,
  };
};

export default CatchAllPage;
