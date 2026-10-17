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
    <div className="about container">
      <figure className="about-art">
        <img
          src="/images/art/about-420.webp"
          srcSet="/images/art/about-420.webp 420w, /images/art/about-840.webp 840w"
          sizes="(max-width: 860px) 60vw, 360px"
          width={420}
          height={525}
          alt="A black cat in a vermilion bucket hat looking up, with camellia petals drifting by."
          decoding="async"
        />
        {/* "Profile" */}
        <span className="about-art-jp jp-vertical" lang="ja" aria-hidden="true">プロフィール</span>
      </figure>
      <div className="about-text">
        <MarkdownPage page={page} />
        <SocialLinks />
      </div>
    </div>
  );
};

export default AboutPage;
