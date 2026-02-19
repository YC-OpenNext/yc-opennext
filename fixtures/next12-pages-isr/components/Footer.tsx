import React from 'react';

/**
 * Footer Component
 * Simple footer with copyright and links
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="content">
        <div className="section">
          <h4>Next.js 12 Fixture</h4>
          <p>A comprehensive test fixture for Pages Router features</p>
        </div>

        <div className="section">
          <h4>Features</h4>
          <ul>
            <li>Server-Side Rendering (SSR)</li>
            <li>Static Site Generation (SSG)</li>
            <li>Incremental Static Regeneration (ISR)</li>
            <li>Dynamic Routes</li>
            <li>API Routes</li>
          </ul>
        </div>

        <div className="section">
          <h4>Resources</h4>
          <ul>
            <li>
              <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
                Next.js Documentation
              </a>
            </li>
            <li>
              <a href="https://github.com/vercel/next.js" target="_blank" rel="noopener noreferrer">
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        <p>&copy; {currentYear} Next.js 12 Fixture. Built for testing purposes.</p>
      </div>

      <style jsx>{`
        .footer {
          background-color: #1a1a1a;
          color: #e5e5e5;
          padding: 3rem 1rem 1rem;
          margin-top: 4rem;
        }

        .content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .section h4 {
          color: #ffffff;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .section p {
          color: #a0a0a0;
          line-height: 1.6;
        }

        .section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .section ul li {
          margin-bottom: 0.5rem;
        }

        .section ul li a {
          color: #a0a0a0;
          text-decoration: none;
          transition: color 0.2s;
        }

        .section ul li a:hover {
          color: #ffffff;
        }

        .copyright {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid #333;
          text-align: center;
        }

        .copyright p {
          color: #808080;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .footer {
            padding: 2rem 1rem 1rem;
            margin-top: 2rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
