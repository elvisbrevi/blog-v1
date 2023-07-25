import './share-button.css';
import {
    FacebookShareButton, FacebookIcon,
    TwitterShareButton, TwitterIcon
  } from "react-share";

var currentUrl = "https://www.elvisbrevi.com/post/static-website-infrastructure-as-code-and-cicd-with-aws-and-github-actions";//window.location.href;

interface ShareButtonProps {
  title: string;
}

const ShareButton = ({ title }: ShareButtonProps) => {
  return (
    <div class="dropdown fixed-bottom">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Share This !
        </button>
        <ul class="dropdown-menu bg-transparent">
            <li>
                <FacebookShareButton url={currentUrl} quote={title}>
                    <FacebookIcon size={32} round />
                    Facebook
                </FacebookShareButton> 
            </li>
            <li>
                <TwitterShareButton url={currentUrl} title={title} >
                    <TwitterIcon size={32} round />
                    Twitter
                </TwitterShareButton> 
            </li>
            <li>
            <a class="twitter-share-button"
  href="https://twitter.com/intent/tweet?text=Hello%20world"
  data-size="large">
Tweet</a>
            </li>
        </ul>
    </div>
  );
};

export default ShareButton;
