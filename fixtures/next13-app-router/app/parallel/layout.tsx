// Parallel Routes - Advanced Next.js 13 feature
// Allows rendering multiple pages in the same layout simultaneously

export default function ParallelLayout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div className="page">
      <h1>Parallel Routes Demo</h1>

      <div className="parallel-container">
        {/* Main content */}
        <section className="parallel-main">{children}</section>

        {/* Parallel slot: @team */}
        <section className="parallel-slot">
          <h2>Team Slot</h2>
          {team}
        </section>

        {/* Parallel slot: @analytics */}
        <section className="parallel-slot">
          <h2>Analytics Slot</h2>
          {analytics}
        </section>
      </div>

      <section className="card">
        <h2>About Parallel Routes</h2>
        <p>
          Parallel routes allow you to simultaneously render multiple pages in the same layout. Each
          slot can have its own loading and error states.
        </p>
        <ul>
          <li>Independent navigation per slot</li>
          <li>Sub-navigation within slots</li>
          <li>Conditional rendering</li>
          <li>Separate loading states</li>
        </ul>
      </section>
    </div>
  );
}
