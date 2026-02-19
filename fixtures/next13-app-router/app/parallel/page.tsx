export default function ParallelPage() {
  return (
    <div className="card">
      <h2>Main Parallel Route</h2>
      <p>
        This is the main content area. The layout shows this alongside the @team and @analytics
        slots.
      </p>
      <p>Parallel routes are useful for:</p>
      <ul>
        <li>Split views (e.g., dashboard with sidebar)</li>
        <li>Modal dialogs</li>
        <li>Tabs with independent navigation</li>
        <li>Complex multi-pane interfaces</li>
      </ul>
    </div>
  );
}
