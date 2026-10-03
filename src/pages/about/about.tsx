import './about.css';
import { use } from 'react';
import MarkdownPage from '../../components/markdown-page/markdown-page';
import SocialLinks from '../../components/socials-links/social-links';
import { loadStaticPage } from '../../services/static-pages-service';
import { usePageMeta } from '../../hooks/use-page-meta';

const AboutPage = () => {
  // Suspends until the page is loaded (see the <Suspense> in app.tsx).
  const page = use(loadStaticPage('about.md'));
  usePageMeta(page?.title, page?.description);

  return (
    <div className="about-container">
      <MarkdownPage page={page} />
      <SocialLinks />
    </div>
  );
};

export default AboutPage;
