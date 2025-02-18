
import './header.css';
const Header = () => {

  return (
    <nav class="navbar navbar-expand-lg">
      <a class="title" href="/">Elvis Brevi</a>
      <div class="list navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="/blog">Blog</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/about">About me</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
