// Route-specific loading UI
// Shown while posts/[id]/page.tsx is loading

export default function PostLoading() {
  return (
    <div className="page">
      <div className="post-skeleton">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-meta"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
      <p className="loading-text">Loading post...</p>
    </div>
  );
}
