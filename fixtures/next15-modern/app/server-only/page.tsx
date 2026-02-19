'use client';

import { useState, useTransition } from 'react';
import { performServerComputation } from '../actions';

export default function ServerOnlyPage() {
  const [input, setInput] = useState(42);
  const [result, setResult] = useState<{
    input: number;
    result: number;
    computeTime: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCompute = () => {
    setError(null);

    startTransition(async () => {
      try {
        const computeResult = await performServerComputation(input);
        setResult(computeResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Computation failed');
      }
    });
  };

  return (
    <div>
      <div className="card">
        <h2>
          Server-Only Code Execution
          <span className="badge">Secure</span>
        </h2>
        <p>
          This page demonstrates executing expensive computations on the server using server
          actions. The computation code never gets bundled in the client JavaScript, ensuring
          security and optimal bundle size.
        </p>
      </div>

      <div className="card">
        <h3>Why Server-Only?</h3>
        <ul style={{ marginLeft: '2rem', lineHeight: '1.8' }}>
          <li>
            <strong>Security:</strong> Sensitive logic stays on the server
          </li>
          <li>
            <strong>Performance:</strong> Heavy computations don&apos;t block the client
          </li>
          <li>
            <strong>Bundle Size:</strong> Computation code isn&apos;t sent to the browser
          </li>
          <li>
            <strong>Server Resources:</strong> Leverage powerful server hardware
          </li>
          <li>
            <strong>Database Access:</strong> Direct database queries without API routes
          </li>
        </ul>
      </div>

      <div className="card">
        <h3>Try Server Computation:</h3>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="input">Input Number:</label>
          <input
            type="number"
            id="input"
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
            disabled={isPending}
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
          />
        </div>

        <button onClick={handleCompute} className="button" disabled={isPending}>
          {isPending ? 'Computing on Server...' : 'Run Server Computation'}
        </button>

        {result && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            <h4>Computation Result:</h4>
            <p>
              <strong>Input:</strong> {result.input}
            </p>
            <p>
              <strong>Result:</strong> {result.result.toLocaleString()}
            </p>
            <p>
              <strong>Server Compute Time:</strong> {result.computeTime}ms
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
              This computation ran entirely on the server. The client only received the final
              result.
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Server Action Implementation:</h3>
        <div className="code">
          {`'use server';

export async function performServerComputation(input: number) {
  const startTime = Date.now();

  // This expensive computation happens ONLY on the server
  // It's never bundled in the client JavaScript
  let result = input;
  for (let i = 0; i < 1000000; i++) {
    result = (result * 1.0001) % 1000000;
  }

  const computeTime = Date.now() - startTime;

  return {
    input,
    result: Math.round(result),
    computeTime,
  };
}`}
        </div>
      </div>

      <div className="card">
        <h3>Real-World Use Cases:</h3>
        <div className="feature-grid">
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Data Processing</h4>
            <p>Process large datasets, generate reports, or perform complex analytics</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>AI/ML Operations</h4>
            <p>Run machine learning models or AI inference on server hardware</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Database Queries</h4>
            <p>Execute complex database queries without exposing connection strings</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>File Operations</h4>
            <p>Read, write, or process files on the server filesystem</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Third-Party APIs</h4>
            <p>Call external APIs with secret keys that stay on the server</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Authentication</h4>
            <p>Verify credentials and generate tokens securely on the server</p>
          </div>
        </div>
      </div>
    </div>
  );
}
