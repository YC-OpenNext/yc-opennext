import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

// Mock product data
const products: Record<
  string,
  {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    features: string[];
  }
> = {
  '1': {
    id: '1',
    name: 'Next.js Starter Kit',
    description: 'Complete starter kit for building modern web applications with Next.js 14',
    price: 99.99,
    category: 'Development Tools',
    stock: 150,
    features: [
      'App Router with React Server Components',
      'TypeScript configuration',
      'Tailwind CSS integration',
      'ESLint and Prettier setup',
      'Testing framework included',
    ],
  },
  '2': {
    id: '2',
    name: 'YC-OpenNext Deployment Guide',
    description: 'Comprehensive guide for deploying Next.js applications to Yandex Cloud',
    price: 49.99,
    category: 'Documentation',
    stock: 500,
    features: [
      'Step-by-step deployment instructions',
      'Best practices for production',
      'Troubleshooting guide',
      'Performance optimization tips',
      'Example configurations',
    ],
  },
  '3': {
    id: '3',
    name: 'React Server Components Course',
    description: 'Learn how to build high-performance applications with React Server Components',
    price: 149.99,
    category: 'Education',
    stock: 75,
    features: [
      'Video tutorials (10+ hours)',
      'Hands-on projects',
      'Source code examples',
      'Community access',
      'Lifetime updates',
    ],
  },
};

// This page uses ISR (Incremental Static Regeneration)
// It will be regenerated every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = products[params.id];

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
    },
  };
}

async function getProduct(id: string) {
  // Simulate async data fetching (e.g., from a database or API)
  await new Promise((resolve) => setTimeout(resolve, 100));

  const product = products[id];

  if (!product) {
    return null;
  }

  return {
    ...product,
    lastUpdated: new Date().toISOString(),
    // Simulate dynamic stock changes
    stock: product.stock + Math.floor(Math.random() * 10) - 5,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="page-container">
      <div className="section">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <a href="/" style={{ color: '#6b7280' }}>
            Home
          </a>
          <span style={{ color: '#6b7280' }}>/</span>
          <a href="/products/1" style={{ color: '#6b7280' }}>
            Products
          </a>
          <span style={{ color: '#6b7280' }}>/</span>
          <span>{product.name}</span>
        </div>
      </div>

      <div className="section">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span className="badge success">ISR - 60s</span>
          <span className="badge">Dynamic Route</span>
        </div>
        <h1 className="page-title">{product.name}</h1>
        <p className="page-description">{product.description}</p>
      </div>

      <div className="section">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          <div>
            <div className="card">
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p style={{ marginTop: '0.5rem' }}>Product Image</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">ISR Information</div>
              <p className="card-description">
                This page is statically generated and revalidated every 60 seconds.
              </p>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <p>
                  <strong>Last Updated:</strong> {product.lastUpdated}
                </p>
                <p>
                  <strong>Revalidation:</strong> 60 seconds
                </p>
                <p>
                  <strong>Product ID:</strong> {params.id}
                </p>
              </div>
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                }}
              >
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Refresh this page multiple times within 60 seconds - you'll see the same
                  timestamp. After 60 seconds, the page will be regenerated with fresh data on the
                  next request.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <div className="card-title">Product Details</div>
              <div style={{ marginTop: '1rem' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}
                >
                  <span style={{ color: '#6b7280' }}>Price:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}
                >
                  <span style={{ color: '#6b7280' }}>Category:</span>
                  <span className="badge">{product.category}</span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}
                >
                  <span style={{ color: '#6b7280' }}>Stock:</span>
                  <span className={product.stock > 10 ? 'badge success' : 'badge warning'}>
                    {product.stock} units
                  </span>
                </div>
              </div>

              <button className="button" style={{ width: '100%', marginTop: '1rem' }}>
                Add to Cart
              </button>
            </div>

            <div className="card">
              <div className="card-title">Features</div>
              <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                {product.features.map((feature, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="card-title">Revalidation Options</div>
              <p className="card-description">
                This page uses time-based revalidation (60 seconds). You can also trigger on-demand
                revalidation using the API:
              </p>
              <pre style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
                <code>{`POST /api/revalidate
{
  "path": "/products/${params.id}"
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Other Products</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {Object.values(products)
            .filter((p) => p.id !== params.id)
            .map((p) => (
              <div key={p.id} className="card">
                <h3 className="card-title">
                  <a href={`/products/${p.id}`}>{p.name}</a>
                </h3>
                <p className="card-description">{p.description}</p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                  }}
                >
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>
                    ${p.price.toFixed(2)}
                  </span>
                  <a
                    href={`/products/${p.id}`}
                    className="button"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="section">
        <a href="/" className="button">
          Back to Home
        </a>
      </div>
    </div>
  );
}
