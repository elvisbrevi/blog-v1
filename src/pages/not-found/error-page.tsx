import './not-found.css';
import { usePageMeta } from '../../hooks/use-page-meta';

// Shown when a page fails to render, e.g. when a new deploy removed the
// JavaScript chunk an already-open tab asks for. Reloading picks up the new one.
const ErrorPage = () => {
  usePageMeta('Something went wrong');

  return (
    <div className="status-page">
      <h1>Something went wrong</h1>
      <p>This page could not be loaded.</p>
      <p>
        <a href={window.location.href}>Reload the page</a>
      </p>
    </div>
  );
};

export default ErrorPage;
