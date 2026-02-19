'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p className="error-message">{error.message}</p>
      {error.digest && <p className="error-digest">Error ID: {error.digest}</p>}
      <button className="reset-button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
