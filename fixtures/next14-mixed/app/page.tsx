export default function Home() {
  return (
    <main>
      <h1>Next.js 14 on Yandex Cloud</h1>
      <p>This is a test application for YC-OpenNext.</p>

      <section>
        <h2>Features</h2>
        <ul>
          <li>App Router</li>
          <li>Server Components</li>
          <li>API Routes</li>
          <li>ISR Support</li>
          <li>Image Optimization</li>
        </ul>
      </section>

      <section>
        <h2>Test Links</h2>
        <ul>
          <li><a href="/api/hello">API Route</a></li>
          <li><a href="/isr">ISR Page</a></li>
          <li><a href="/dynamic">Dynamic Page</a></li>
        </ul>
      </section>
    </main>
  )
}