import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
};

// Mock blog post data
const blogPosts: Record<string, { title: string; content: string; author: string; date: string }> =
  {
    'first-post': {
      title: 'Getting Started with Next.js 14',
      content: `
      Next.js 14 introduces several exciting features and improvements that make building
      React applications even better. In this post, we'll explore some of the key features
      including the App Router, Server Components, and improved performance.

      The App Router is a new paradigm that leverages React Server Components to enable
      powerful new patterns for building applications. It provides better performance,
      improved developer experience, and more flexibility in how you structure your app.

      Server Components allow you to render components on the server, reducing the amount
      of JavaScript sent to the client and improving initial page load times. This is
      especially beneficial for content-heavy pages.

      With features like Incremental Static Regeneration (ISR), you can have the best of
      both worlds: static generation for performance and dynamic updates when content changes.
    `,
      author: 'YC-OpenNext Team',
      date: '2024-01-15',
    },
    'dynamic-routing': {
      title: 'Dynamic Routing in Next.js',
      content: `
      Dynamic routing is a powerful feature in Next.js that allows you to create pages
      based on dynamic data. This is perfect for blog posts, product pages, and any other
      content that needs to be generated from a data source.

      In the App Router, you can create dynamic routes by using square brackets in your
      folder names. For example, [slug] creates a dynamic segment that can match any value.

      You can access the dynamic segment through the params prop, which is passed to your
      page component. This makes it easy to fetch data based on the URL parameter.

      Dynamic routes can be combined with other Next.js features like ISR and SSR to create
      highly performant and flexible applications.
    `,
      author: 'YC-OpenNext Team',
      date: '2024-01-20',
    },
    'yandex-cloud-deployment': {
      title: 'Deploying Next.js to Yandex Cloud',
      content: `
      Deploying Next.js applications to Yandex Cloud is now easier than ever with YC-OpenNext.
      This tool adapts Next.js applications to run on Yandex Cloud infrastructure, taking
      advantage of serverless computing and edge delivery.

      YC-OpenNext handles all the complexity of deploying Next.js features like ISR, server
      actions, and API routes to Yandex Cloud. It automatically configures the necessary
      cloud resources and optimizes your application for production.

      The deployment process is straightforward: build your Next.js app, run YC-OpenNext,
      and deploy the output to Yandex Cloud. Your application will be served with high
      performance and scalability.

      With YC-OpenNext, you get the full power of Next.js combined with the reliability
      and performance of Yandex Cloud infrastructure.
    `,
      author: 'YC-OpenNext Team',
      date: '2024-02-01',
    },
  };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts[params.slug];

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160).trim() + '...',
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160).trim() + '...',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

async function getBlogPost(slug: string) {
  // Simulate async data fetching
  await new Promise((resolve) => setTimeout(resolve, 100));

  const post = blogPosts[slug];

  if (!post) {
    return null;
  }

  return {
    ...post,
    slug,
    readTime: Math.ceil(post.content.split(' ').length / 200), // Approximate read time
    generatedAt: new Date().toISOString(),
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="page-container">
      <article>
        <header className="section">
          <h1 className="page-title">{post.title}</h1>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span className="badge">SSR</span>
            <span className="badge">Dynamic Route</span>
          </div>
          <div style={{ color: '#6b7280', marginBottom: '2rem' }}>
            <p>
              By {post.author} •{' '}
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              • {post.readTime} min read
            </p>
          </div>
        </header>

        <div className="section">
          <div className="card">
            <h3 className="card-title">Rendering Information</h3>
            <p className="card-description">
              This page is dynamically rendered on the server for each request (SSR). The slug
              parameter is: <code>{params.slug}</code>
            </p>
            <div style={{ marginTop: '1rem' }}>
              <p>
                <strong>Generated at:</strong> {post.generatedAt}
              </p>
              <p>
                <strong>Rendering strategy:</strong> Server-Side Rendering (SSR)
              </p>
              <p>
                <strong>Dynamic segment:</strong> [slug]
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="card">
            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{post.content.trim()}</div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Other Blog Posts</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(blogPosts)
              .filter(([slug]) => slug !== params.slug)
              .map(([slug, post]) => (
                <div key={slug} className="card">
                  <h3 className="card-title">
                    <a href={`/blog/${slug}`}>{post.title}</a>
                  </h3>
                  <p className="card-description">{post.content.substring(0, 150).trim()}...</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </article>

      <div className="section">
        <a href="/" className="button">
          Back to Home
        </a>
      </div>
    </div>
  );
}
