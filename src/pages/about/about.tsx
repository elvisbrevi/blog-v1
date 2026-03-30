import './about.css';
import { useEffect, useState } from 'react';
import MarkdownPage from '../../components/markdown-page/markdown-page';
import SocialLinks from '../../components/socials-links/social-links';
import { loadStaticPage, StaticPage } from '../../services/static-pages-service';
import { Loading } from '../../components/loading/loading';

const AboutPage = () => {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      const data = await loadStaticPage('about.md');
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
          <div className="about-container">
            <MarkdownPage page={page} />
            <SocialLinks />
          </div>
        </div>
        <div />
      </div>
    </div>
  );
};

export default AboutPage;
