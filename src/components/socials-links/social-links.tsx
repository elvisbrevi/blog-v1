import './social-links.css';
import { GitHubIcon, LinkedInIcon, XIcon } from '../icons/icons';
import { SOCIAL_LINKS } from '../../site';

const ICONS = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  twitter: XIcon,
};

const SocialLinks = () => {
  return (
    <ul className="social-links">
      {SOCIAL_LINKS.map((link) => {
        const Icon = ICONS[link.id];
        return (
          <li key={link.id}>
            <a
              id={`link-${link.id}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={link.id}
            >
              <Icon />
              <span>{link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialLinks;
