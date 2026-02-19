import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import styles from '@/styles/Home.module.css';

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

interface BlogPostPageProps {
  post: BlogPost;
  generatedAt: string;
}

// Mock blog posts data
const mockPosts: BlogPost[] = [
  {
    slug: 'hello-world',
    title: 'Hello World - My First Post',
    content: 'This is my first blog post. Welcome to my Next.js 12 blog built with ISR!',
    author: 'John Doe',
    publishedAt: '2023-01-15',
    tags: ['introduction', 'nextjs', 'webdev'],
  },
  {
    slug: 'nextjs-12-features',
    title: 'Exploring Next.js 12 Features',
    content:
      'Next.js 12 brings amazing features like the SWC compiler, middleware, and improved performance.',
    author: 'Jane Smith',
    publishedAt: '2023-02-20',
    tags: ['nextjs', 'features', 'performance'],
  },
  {
    slug: 'isr-explained',
    title: 'Understanding Incremental Static Regeneration',
    content:
      "ISR allows you to update static content without rebuilding your entire site. Let's explore how it works.",
    author: 'Bob Johnson',
    publishedAt: '2023-03-10',
    tags: ['isr', 'nextjs', 'tutorial'],
  },
];

/**
 * Dynamic blog post page
 * Uses getStaticPaths to pre-generate pages for all blog posts
 * Uses getStaticProps to fetch data for each post
 */
const BlogPostPage: NextPage<BlogPostPageProps> = ({ post, generatedAt }) => {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // until getStaticProps() finishes running
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
        <title>{post.title} - Next.js 12 Blog</title>
        <meta name="description" content={post.content.substring(0, 160)} />
        <meta name="author" content={post.author} />
        <meta name="keywords" content={post.tags.join(', ')} />
      </Head>

      <main className={styles.main}>
        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <h1 className={styles.title}>{post.title}</h1>

            <div className={styles.meta}>
              <p>
                <strong>Author:</strong> {post.author}
              </p>
              <p>
                <strong>Published:</strong> {new Date(post.publishedAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Generated:</strong> {new Date(generatedAt).toLocaleString()}
              </p>
            </div>

            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <div className={styles.content}>
            <p>{post.content}</p>
          </div>

          <div className={styles.info}>
            <p className={styles.note}>
              This page was pre-generated using <code>getStaticPaths</code> and{' '}
              <code>getStaticProps</code>. It will be regenerated in the background every 60
              seconds.
            </p>
          </div>
        </article>

        <div className={styles.navigation}>
          <h3>Other Posts:</h3>
          <ul>
            {mockPosts
              .filter((p) => p.slug !== post.slug)
              .map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
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
  // Generate paths for all blog posts
  const paths = mockPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    // Enable fallback: 'blocking' to generate pages on-demand
    // for slugs that weren't pre-generated
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Find the post by slug
  const post = mockPosts.find((p) => p.slug === slug);

  // If post not found, return 404
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      generatedAt: new Date().toISOString(),
    },
    // Revalidate every 60 seconds
    revalidate: 60,
  };
};

export default BlogPostPage;
