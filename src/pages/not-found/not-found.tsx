import './not-found.css';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../../hooks/use-page-meta';

const NotFoundPage = () => {
  usePageMeta('Page not found');

  return (
    <div className="status-page container">
      <figure className="status-art">
        <img
          src="/images/art/not-found-400.webp"
          srcSet="/images/art/not-found-400.webp 400w, /images/art/not-found-800.webp 800w"
          sizes="(max-width: 760px) 70vw, 360px"
          width={400}
          height={400}
          alt="A black cat under a paper umbrella on a rainy night, holding a map upside down."
          decoding="async"
        />
      </figure>
      <div className="status-text">
        {/* "Lost" */}
        <p className="status-jp" lang="ja" aria-hidden="true">まいご</p>
        <p className="label">Error 404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <p>
          <Link className="button" to="/">← Back to the blog</Link>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
