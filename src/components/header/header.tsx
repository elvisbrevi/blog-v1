import './header.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from '../theme-toggle/theme-toggle';

const Header = () => {
  const { pathname } = useLocation();
  // The post list lives at both / and /blog, and posts belong to the blog section.
  const inBlog = pathname === '/' || pathname.startsWith('/blog') || pathname.startsWith('/post/');

  return (
    <header className="site-header">
      <div className="site-header-inner container">
        <Link className="brand" to="/">
          {/* A hanko, the name seal: "Brevi" in katakana. */}
          <span className="brand-seal" lang="ja" aria-hidden="true">ブレビ</span>
          <span className="brand-name">Elvis Brevi</span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          <ul className="nav-list">
            <li>
              <Link className="nav-link" to="/blog" aria-current={inBlog ? 'page' : undefined}>Blog</Link>
            </li>
            <li>
              <NavLink className="nav-link" to="/side-projects">Side Projects</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/about">About me</NavLink>
            </li>
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
