import './side-projects.css';
import '../../themes/prose.css';
import { use, useMemo } from 'react';
import { loadStaticPage } from '../../services/static-pages-service';
import { renderMarkdown } from '../../services/markdown-service';
import { usePageMeta } from '../../hooks/use-page-meta';

// side-projects.md is an introduction followed by one `## [Name](url)` section
// per project; each section becomes a card.
function splitProjects(markdown: string): { intro: string; projects: string[] } {
  const [intro, ...projects] = markdown.split(/^(?=## )/m);
  return {
    intro: renderMarkdown(intro),
    projects: projects.map((project) => renderMarkdown(project))
  };
}

const SideProjectsPage = () => {
  // Suspends until the page is loaded (see the <Suspense> in app.tsx).
  const page = use(loadStaticPage('side-projects.md'));
  usePageMeta(page?.title, page?.description);
  const content = useMemo(() => splitProjects(page?.content ?? ''), [page?.content]);

  if (!page) {
    return (
      <div className="side-projects container">
        <p>This page could not be loaded. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="side-projects container">
      <header className="projects-header">
        <div className="projects-intro prose" dangerouslySetInnerHTML={{ __html: content.intro }} />
        <figure className="projects-art">
          <img
            src="/images/art/side-projects-720.webp"
            srcSet="/images/art/side-projects-720.webp 720w, /images/art/side-projects-1440.webp 1440w"
            sizes="(max-width: 860px) 92vw, 560px"
            width={720}
            height={480}
            alt="Elvis building a tin robot at a wooden workbench, with a kite, a game controller and a small screen."
            decoding="async"
          />
          {/* "Side projects" */}
          <span className="projects-art-jp jp-vertical" lang="ja" aria-hidden="true">サイドプロジェクト</span>
        </figure>
      </header>
      <ol className="project-grid">
        {content.projects.map((project, index) => (
          <li
            key={index}
            className="project-card prose"
            dangerouslySetInnerHTML={{ __html: project }}
          />
        ))}
      </ol>
    </div>
  );
};

export default SideProjectsPage;
