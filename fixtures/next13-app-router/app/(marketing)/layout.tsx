// Nested layout for the marketing route group
// Route groups use (folder) syntax and don't affect URL structure

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-layout">
      <aside className="marketing-sidebar">
        <h3>Marketing Section</h3>
        <nav className="sidebar-nav">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/team">Team</a>
        </nav>
      </aside>
      <div className="marketing-content">{children}</div>
    </div>
  );
}
