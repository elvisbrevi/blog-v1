import './side-projects.css';
import { useEffect, useState } from 'react';
import MarkdownPage from '../../components/markdown-page/markdown-page';
import { loadStaticPage, StaticPage } from '../../services/static-pages-service';
import { Loading } from '../../components/loading/loading';

const SideProjectsPage = () => {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      const data = await loadStaticPage('side-projects.md');
      setPage(data);
      setLoading(false);
    }
    loadPage();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="row">
        <div />
        <div>
          <div className="side-projects-container">
            <MarkdownPage page={page} />
          </div>
        </div>
        <div />
      </div>
    </div>
  );
};

export default SideProjectsPage;
