import './about.css';
import SocialLinks from '../../components/socials-links/social-links';

const AboutPage: preact.FunctionComponent = () => {
  return (
    <div className="about-container">
      <div className="about-image-container">
        <h1 className="about-title post-title-font">Welcome!</h1>
        <p className="about-description post-description-font">
          This is my personal 'programmer' website! Here you'll find everything related to my passion for 
          programming. If you're interested in getting to know me better, you can find my official LinkedIn, 
          Twitter, and GitHub accounts. In the near future, I'll also be publishing small projects and 
          sharing my ideas and experiences on my blog. I hope you enjoy my site and if you have any questions, 
          feel free to contact me. Thanks for stopping by!
        </p>
      </div>
      <SocialLinks />
    </div>
  );
};

export default AboutPage;
