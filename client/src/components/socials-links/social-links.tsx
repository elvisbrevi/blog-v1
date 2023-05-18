import './social-links.css';

const SocialLinks = () => {
  return (
    <div className="social-links">
      <a
        id="link-linkedin"
        href="https://www.linkedin.com/in/elvisbrevi/"
        target="_blank"
        className="linkedin" 
      >
        LinkedIn
      </a>
      <a
        id="link-github"
        href="https://github.com/elvisbrevi"
        target="_blank"
        className="github" 
      >
        GitHub
      </a>
      <a
        id="link-twitter"
        href="https://twitter.com/elvisbrevi"
        target="_blank"
        className="twitter" 
      >
        Twitter
      </a>
    </div>
  );
};

export default SocialLinks;
