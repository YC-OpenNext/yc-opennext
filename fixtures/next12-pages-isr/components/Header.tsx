import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Header Component
 * Navigation header with logo and menu
 */
const Header: React.FC = () => {
  const router = useRouter();

  const isActive = (pathname: string): boolean => {
    return router.pathname === pathname;
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <Link href="/">Next.js 12 Fixture</Link>
        </div>

        <ul className="menu">
          <li>
            <Link href="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/static" className={isActive('/static') ? 'active' : ''}>
              Static
            </Link>
          </li>
          <li>
            <Link href="/isr" className={isActive('/isr') ? 'active' : ''}>
              ISR
            </Link>
          </li>
          <li>
            <Link href="/blog/hello-world" className={isActive('/blog/[slug]') ? 'active' : ''}>
              Blog
            </Link>
          </li>
        </ul>
      </nav>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .logo :global(a) {
          color: white;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .logo :global(a:hover) {
          opacity: 0.8;
        }

        .menu {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .menu li :global(a) {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .menu li :global(a:hover),
        .menu li :global(a.active) {
          background-color: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .nav {
            flex-direction: column;
            gap: 1rem;
          }

          .menu {
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .menu li :global(a) {
            padding: 0.25rem 0.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
