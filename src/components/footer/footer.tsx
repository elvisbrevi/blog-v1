import './footer.css';
import { SITE, SOCIAL_LINKS } from '../../site';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner container">
        <div className="footer-sign">
          {/* "Thank you" */}
          <p className="footer-jp" lang="ja" aria-hidden="true">ありがとう</p>
          <p className="footer-thanks">Thanks for reading.</p>
        </div>
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
        <p className="footer-copy">© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  );
};

export default Footer;
