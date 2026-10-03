import './footer.css';
import { SITE, SOCIAL_LINKS } from '../../site';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <ul className="footer-links">
          <li>
            <a href="/rss.xml">RSS</a>
          </li>
          {SOCIAL_LINKS.map((link) => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
