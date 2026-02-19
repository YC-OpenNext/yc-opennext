// Parallel route slot: @analytics
// This slot can load independently of the @team slot

async function getAnalyticsData() {
  // Simulate async data fetch
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    pageViews: 12543,
    uniqueVisitors: 3421,
    avgSessionDuration: '3m 42s',
    bounceRate: '42.3%',
  };
}

export default async function AnalyticsSlot() {
  const analytics = await getAnalyticsData();

  return (
    <div className="card">
      <h3>Analytics Overview</h3>
      <div className="analytics-grid">
        <div className="metric">
          <div className="metric-value">{analytics.pageViews.toLocaleString()}</div>
          <div className="metric-label">Page Views</div>
        </div>
        <div className="metric">
          <div className="metric-value">{analytics.uniqueVisitors.toLocaleString()}</div>
          <div className="metric-label">Unique Visitors</div>
        </div>
        <div className="metric">
          <div className="metric-value">{analytics.avgSessionDuration}</div>
          <div className="metric-label">Avg. Session</div>
        </div>
        <div className="metric">
          <div className="metric-value">{analytics.bounceRate}</div>
          <div className="metric-label">Bounce Rate</div>
        </div>
      </div>
      <p className="slot-info">This slot has its own loading state and error boundary.</p>
    </div>
  );
}
