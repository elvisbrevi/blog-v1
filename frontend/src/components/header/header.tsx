
import './header.css';
import { useEffect, useState } from 'preact/hooks';
import { Link } from 'react-router-dom';

const Header = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="header-nav">
      <div className={`header-menu ${windowWidth <= 768 ? 'responsive' : ''}`}>
        <Link to="/blog"><p id="title" className='anton-font'>Elvis Brevi</p></Link>
        <Link to="/blog">Blog</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
};

export default Header;
