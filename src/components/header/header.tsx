import './header.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from '../theme-toggle/theme-toggle';

const Header = () => {
  const { pathname } = useLocation();
  // The post list lives at both / and /blog, and posts belong to the blog section.
  const inBlog = pathname === '/' || pathname.startsWith('/blog') || pathname.startsWith('/post/');

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main">
        <Link className="title" to="/">Elvis Brevi</Link>
        <div className="list">
          <ul className="nav-list">
            <li className="nav-item">
              <Link className="nav-link" to="/blog" aria-current={inBlog ? 'page' : undefined}>Blog</Link>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/side-projects">Side Projects</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About me</NavLink>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
