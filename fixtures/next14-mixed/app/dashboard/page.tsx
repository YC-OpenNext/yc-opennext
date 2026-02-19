'use client';

import { useState, useEffect } from 'react';

/**
 * Dashboard - Client Component Example
 *
 * This component uses the 'use client' directive, making it a Client Component.
 * It demonstrates:
 * - Client-side interactivity
 * - React hooks (useState, useEffect)
 * - Browser APIs (window, localStorage)
 * - Client-side data fetching
 */

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);

    // Load count from localStorage
    const savedCount = localStorage.getItem('dashboardCount');
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save count to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('dashboardCount', count.toString());
    }
  }, [count, mounted]);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="section">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span className="badge warning">Client Component</span>
          <span className="badge">Interactive</span>
        </div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          This is a client-side rendered page using React hooks and browser APIs
        </p>
      </div>

      <div className="section">
        <div className="card">
          <div className="card-title">Client-Side Information</div>
          <p className="card-description">
            This component runs in the browser and has access to client-side APIs
          </p>
          <div style={{ marginTop: '1rem' }}>
            <p>
              <strong>Current Time:</strong> {currentTime.toLocaleTimeString()}
            </p>
            <p>
              <strong>Screen Width:</strong> {window.innerWidth}px
            </p>
            <p>
              <strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...
            </p>
            <p>
              <strong>Online Status:</strong> {navigator.onLine ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Interactive Counter</h2>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCount(count - 1)}
              className="button"
              style={{ backgroundColor: '#dc2626' }}
            >
              Decrement
            </button>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                padding: '1rem 2rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem',
              }}
            >
              {count}
            </div>
            <button
              onClick={() => setCount(count + 1)}
              className="button"
              style={{ backgroundColor: '#059669' }}
            >
              Increment
            </button>
            <button onClick={() => setCount(0)} className="button">
              Reset
            </button>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            This counter persists in localStorage and will maintain its value across page refreshes
          </p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Products Loader</h2>
        <div className="card">
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={fetchProducts} disabled={loading} className="button">
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="spinner" />
                  Loading...
                </span>
              ) : (
                'Fetch Products'
              )}
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#fee2e2',
                border: '1px solid #dc2626',
                borderRadius: '0.5rem',
                color: '#991b1b',
                marginBottom: '1rem',
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}

          {products.length > 0 && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="search">
                  Search Products
                </label>
                <input
                  id="search"
                  type="text"
                  className="form-input"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
                  Showing {filteredProducts.length} of {products.length} products
                </p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            {product.name}
                          </h3>
                          <span className="badge">{product.category}</span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Form Example</h2>
        <div className="card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('name');
              const email = formData.get('email');
              alert(`Form submitted!\nName: ${name}\nEmail: ${email}`);
            }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="button">
              Submit
            </button>
          </form>
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
