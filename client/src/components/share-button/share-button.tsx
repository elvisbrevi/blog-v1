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
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Share This !
        </button>
        <ul class="dropdown-menu bg-transparent">
            <li>
                <FacebookShareButton url={currentUrl} quote={title}>
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
            </li>
            <li>
                <TwitterShareButton url={currentUrl} title={title} >
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
            </li>
            <li><a class="dropdown-item" href="#">Action three</a></li>
        </ul>
    </div>
  );
};

export default ShareButton;
