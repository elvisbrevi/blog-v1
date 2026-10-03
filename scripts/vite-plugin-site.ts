import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import type { Plugin, Rollup } from 'vite';
import { POST_FILES } from '../src/services/post-files';
import { pageTitle, SITE } from '../src/site';

// Static pages that get their own HTML file: route name = markdown file in
// public/static-pages/ (title and description come from its front matter).
const STATIC_PAGES = ['about', 'side-projects'];

const META_PLACEHOLDER = '<!-- site-meta -->';
const META_START = '<!-- site-meta:start -->';
const META_END = '<!-- site-meta:end -->';

interface PageMeta {
  path: string;
  title?: string;
  description: string;
  image?: string;
  publishedTime?: string;
  // Extra <link> tags, e.g. preloads for what the page renders first.
  preloads?: string[];
}

interface PostInfo {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  date: Date;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function metaTags(page: PageMeta): string {
  const url = SITE.url + page.path;
  const image = SITE.url + (page.image ?? '/images/android-chrome-512x512.png');
  const tags = [
    `<title>${escapeXml(pageTitle(page.title))}</title>`,
    `<meta name="description" content="${escapeXml(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${escapeXml(SITE.name)}" />`,
    `<meta property="og:type" content="${page.publishedTime ? 'article' : 'website'}" />`,
    `<meta property="og:title" content="${escapeXml(page.title ?? SITE.name)}" />`,
    `<meta property="og:description" content="${escapeXml(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="${page.image ? 'summary_large_image' : 'summary'}" />`
  ];
  if (page.publishedTime) {
    tags.push(`<meta property="article:published_time" content="${page.publishedTime}" />`);
  }
  return [META_START, ...tags, ...(page.preloads ?? []), META_END].join('\n    ');
}

// Preloads for the lazily loaded chunks (and their CSS) a page needs, so the
// browser fetches them together with the main bundle instead of after it runs.
function chunkPreloads(bundle: Rollup.OutputBundle, modules: string[]): string[] {
  const chunks = Object.values(bundle).filter((file): file is Rollup.OutputChunk => file.type === 'chunk');
  const byFileName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
  const scripts = new Set<string>();
  const styles = new Set<string>();

  const visit = (chunk: Rollup.OutputChunk) => {
    if (chunk.isEntry || scripts.has(chunk.fileName)) return;
    scripts.add(chunk.fileName);
    chunk.viteMetadata?.importedCss.forEach((css) => styles.add(css));
    chunk.imports.forEach((fileName) => {
      const imported = byFileName.get(fileName);
      if (imported) visit(imported);
    });
  };
  for (const module of modules) {
    const chunk = chunks.find((candidate) => candidate.facadeModuleId?.endsWith(module));
    if (chunk) visit(chunk);
  }

  return [
    ...[...styles].map((css) => `<link rel="preload" as="style" crossorigin href="/${css}" />`),
    ...[...scripts].map((js) => `<link rel="modulepreload" crossorigin href="/${js}" />`)
  ];
}

const fetchPreload = (href: string) => `<link rel="preload" as="fetch" crossorigin href="${href}" />`;

function readFrontMatter(file: string): Record<string, unknown> {
  return matter(readFileSync(file, 'utf8')).data;
}

function readPosts(root: string): PostInfo[] {
  return POST_FILES.map((file) => {
    const data = readFrontMatter(resolve(root, 'posts', file));
    const date = new Date(String(data.date ?? file.slice(0, 10)));
    return {
      slug: file.replace(/\.md$/, ''),
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      cover: data.cover ? String(data.cover) : undefined,
      date: Number.isNaN(date.getTime()) ? new Date(file.slice(0, 10)) : date
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());
}

function rss(posts: PostInfo[]): string {
  const items = posts.map((post) => {
    const url = `${SITE.url}/post/${post.slug}`;
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${SITE.url}/</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${(posts[0]?.date ?? new Date()).toUTCString()}</lastBuildDate>${items.join('')}
  </channel>
</rss>
`;
}

function sitemap(paths: { path: string; lastmod?: Date }[]): string {
  const urls = paths.map(({ path, lastmod }) => {
    const date = lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
    return `  <url><loc>${SITE.url}${path}</loc>${date}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

/**
 * Fills the <head> of index.html with the title, description, canonical URL
 * and social tags, and on build also writes:
 * - post/<slug>.html, about.html and side-projects.html: index.html with that
 *   page's tags. Link previews (LinkedIn, X, WhatsApp...) don't run JavaScript,
 *   so they only see these. Cloudflare Pages serves them at /post/<slug>, etc.
 * - rss.xml, sitemap.xml and robots.txt.
 */
export function sitePlugin(): Plugin {
  let root = process.cwd();

  return {
    name: 'site-meta',
    // Runs after Vite has added the built index.html to the bundle.
    enforce: 'post',
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml(html) {
      return html.replace(META_PLACEHOLDER, metaTags({ path: '/', description: SITE.description }));
    },
    generateBundle(_, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') return;

      const template = String(index.source);
      const start = template.indexOf(META_START);
      const end = template.indexOf(META_END) + META_END.length;
      if (start === -1 || end < start) {
        this.error('index.html is missing the <!-- site-meta --> placeholder');
      }
      const emitPage = (fileName: string, page: PageMeta) => {
        const source = template.slice(0, start) + metaTags(page) + template.slice(end);
        this.emitFile({ type: 'asset', fileName, source });
      };

      const frontMatterParser = '/src/services/front-matter.ts';
      const postChunks = chunkPreloads(bundle, ['/src/pages/post/post.tsx', frontMatterParser]);
      const posts = readPosts(root);
      for (const post of posts) {
        emitPage(`post/${post.slug}.html`, {
          path: `/post/${post.slug}`,
          title: post.title,
          description: post.description || SITE.description,
          image: post.cover,
          publishedTime: post.date.toISOString(),
          // No preload for the cover: it would compete with the scripts for bandwidth.
          preloads: [fetchPreload(`/posts/${post.slug}.md`), ...postChunks]
        });
      }

      for (const name of STATIC_PAGES) {
        const data = readFrontMatter(resolve(root, 'public/static-pages', `${name}.md`));
        emitPage(`${name}.html`, {
          path: `/${name}`,
          title: data.title ? String(data.title) : undefined,
          description: data.description ? String(data.description) : SITE.description,
          preloads: [
            fetchPreload(`/static-pages/${name}.md`),
            ...chunkPreloads(bundle, [`/src/pages/${name}/${name}.tsx`, frontMatterParser])
          ]
        });
      }

      this.emitFile({ type: 'asset', fileName: 'rss.xml', source: rss(posts) });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemap([
          { path: '/' },
          ...STATIC_PAGES.map((name) => ({ path: `/${name}` })),
          ...posts.map((post) => ({ path: `/post/${post.slug}`, lastmod: post.date }))
        ])
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`
      });
    }
  };
}
