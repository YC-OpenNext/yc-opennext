import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Dynamic route: [id] is a dynamic segment

type Props = {
  params: { id: string };
};

// Generate metadata dynamically based on the route params
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  return {
    title: `Post ${id}`,
    description: `Dynamic post page for ID: ${id}`,
  };
}

// Simulate fetching post data
async function getPost(id: string) {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate not found
  if (id === 'error') {
    throw new Error('Failed to fetch post');
  }

  if (id === '999') {
    return null;
  }

  return {
    id,
    title: `Post ${id}`,
    content: `This is the content for post ${id}. This page demonstrates dynamic routing in Next.js 13 App Router.`,
    author: 'Next.js Developer',
    publishedAt: new Date().toISOString(),
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.id);

  // Trigger not-found page
  if (!post) {
    notFound();
  }

  return (
    <div className="page">
      <article className="post">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span>By {post.author}</span>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
        </header>

        <div className="post-content">
          <p>{post.content}</p>
        </div>

        <section className="card">
          <h2>Dynamic Route Features</h2>
          <ul>
            <li>
              URL parameter: <code>{post.id}</code>
            </li>
            <li>Dynamic metadata generation</li>
            <li>Async Server Component data fetching</li>
            <li>Route-specific loading UI</li>
          </ul>
        </section>

        <section className="card">
          <h3>Try These Routes</h3>
          <div className="links">
            <a href="/posts/1" className="link-button">
              Post 1
            </a>
            <a href="/posts/2" className="link-button">
              Post 2
            </a>
            <a href="/posts/999" className="link-button">
              Not Found
            </a>
            <a href="/posts/error" className="link-button">
              Trigger Error
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}

// Optional: Generate static params at build time
// Uncomment to enable Static Site Generation (SSG)
// export async function generateStaticParams() {
//   return [
//     { id: '1' },
//     { id: '2' },
//     { id: '3' },
//   ]
// }
