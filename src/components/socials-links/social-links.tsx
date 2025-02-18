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
        <i class="bi bi-linkedin mr-10"></i>
      </a>
      <a
        id="link-github"
        href="https://github.com/elvisbrevi"
        target="_blank"
        className="github" 
      >
        <i class="bi bi-github"></i>
      </a>
      <a
        id="link-twitter"
        href="https://twitter.com/elvisbrevi"
        target="_blank"
        className="twitter" 
      >
        <i class="bi bi-twitter-x"></i>
      </a>
    </div>
  );
};

export default SocialLinks;
