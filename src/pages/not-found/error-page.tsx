import './not-found.css';
import { usePageMeta } from '../../hooks/use-page-meta';

// Shown when a page fails to render, e.g. when a new deploy removed the
// JavaScript chunk an already-open tab asks for. Reloading picks up the new one.
const ErrorPage = () => {
  usePageMeta('Something went wrong');

  return (
    <div className="status-page container">
      <div className="status-text">
        {/* "Oops" */}
        <p className="status-jp" lang="ja" aria-hidden="true">あれれ</p>
        <h1>Something went wrong</h1>
        <p>This page could not be loaded.</p>
        <p>
          <a className="button" href={window.location.href}>Reload the page</a>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
