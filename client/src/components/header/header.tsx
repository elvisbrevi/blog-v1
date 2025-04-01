
import './header.css';
const Header = () => {

  return (
    <nav className="navbar navbar-expand-lg">
      <a className="title" href="/">Elvis Brevi</a>
      <div className="list navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item active">
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
