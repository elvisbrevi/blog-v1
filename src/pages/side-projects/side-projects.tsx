import './side-projects.css';
import { use } from 'react';
import MarkdownPage from '../../components/markdown-page/markdown-page';
import { loadStaticPage } from '../../services/static-pages-service';
import { usePageMeta } from '../../hooks/use-page-meta';

const SideProjectsPage = () => {
  // Suspends until the page is loaded (see the <Suspense> in app.tsx).
  const page = use(loadStaticPage('side-projects.md'));
  usePageMeta(page?.title, page?.description);

  return (
    <div className="side-projects-container">
      <MarkdownPage page={page} />
    </div>
  );
};

export default SideProjectsPage;
