import './header.css';
const Header = () => {

  return (
    <nav className="navbar">
      <a className="title" href="/">Elvis Brevi</a>
      <div className="list">
        <ul className="nav-list">
          <li className="nav-item">
            <a className="nav-link" href="/blog">Blog</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">About me</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
