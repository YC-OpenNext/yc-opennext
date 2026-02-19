'use client'; // Client Component directive

import { useState, useEffect } from 'react';

// Note: Client Components cannot export metadata
// Metadata must be in parent Server Component or layout

export default function DashboardPage() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState<{ id: number; title: string; content: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  // Client-side data fetching
  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  // Client-side timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page">
      <h1>Dashboard - Client Component</h1>

      <section className="card">
        <h2>Client Component Features</h2>
        <p>
          This component uses the <code>'use client'</code> directive.
        </p>
        <ul>
          <li>Interactive state management</li>
          <li>Event handlers</li>
          <li>Browser-only APIs</li>
          <li>React hooks</li>
        </ul>
      </section>

      <section className="card">
        <h2>Interactive Counter</h2>
        <div className="counter">
          <button onClick={() => setCount(count - 1)} className="counter-button">
            -
          </button>
          <span className="counter-value">{count}</span>
          <button onClick={() => setCount(count + 1)} className="counter-button">
            +
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Live Clock</h2>
        <p className="clock">{time.toLocaleTimeString()}</p>
      </section>

      <section className="card">
        <h2>Client-Side Data Fetching</h2>
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <ul className="posts-list">
            {posts.map((post) => (
              <li key={post.id}>
                <strong>{post.title}</strong>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Server vs Client Components</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Server</th>
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fetch data</td>
              <td>Yes</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Access backend</td>
              <td>Yes</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Interactivity</td>
              <td>No</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Use hooks</td>
              <td>No</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>JS bundle</td>
              <td>Zero</td>
              <td>Included</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
