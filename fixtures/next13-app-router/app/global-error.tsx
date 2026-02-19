'use client'; // Global error components must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="error-container">
          <h1>Application Error</h1>
          <h2>Something went wrong at the application level!</h2>
          <p className="error-message">{error.message}</p>
          {error.digest && <p className="error-digest">Error ID: {error.digest}</p>}
          <button className="reset-button" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
