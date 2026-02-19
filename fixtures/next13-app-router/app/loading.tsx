// Loading UI for the root layout
// Automatically shown while page.tsx is loading

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
