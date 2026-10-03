import './not-found.css';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../../hooks/use-page-meta';

const NotFoundPage = () => {
  usePageMeta('Page not found');

  return (
    <div className="status-page">
      <p className="status-code">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <p>
        <Link to="/">← Back to the blog</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
