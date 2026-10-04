# AGENTS.md

## Commands

```sh
npm run dev        # Vite dev server
npm run build      # typecheck (tsc -b) then bundle (vite build)
npm run lint       # ESLint flat config
npm run preview    # Vite preview (production build preview)
```

Build runs `tsc -b` first — type errors block the bundle.

**No GitHub Actions**, in this or any of the author's repos: never add
`.github/workflows/` or any other hosted CI. Check locally with
`npm run lint && npm run build` before pushing; Cloudflare Pages builds every
pushed branch.

## Architecture

**Client-side SPA** — React 19 + React Router v7 + TypeScript 5.7, bundled with Vite 6. No SSR/SSG. No database. All content is markdown files loaded at runtime via `fetch()`. Deployed on Cloudflare Pages (every branch gets a preview URL).

- **Routing**: `createBrowserRouter` in `src/app.tsx`. Internal links must use React Router's `<Link>`/`<NavLink>` (a plain `<a href>` reloads the whole app). `<ScrollRestoration>` restores the scroll position on back/forward.
- **Code splitting**: the post, about and side-projects pages are `lazy()` routes, so the post list doesn't download `marked` or highlight.js.
- **Data loading**: services return cached promises (one request per file per page load) that pages read with React's `use()` inside `<Suspense>`. Keep returning the same promise for the same input, or `use()` suspends forever.
- **Site metadata**: `src/site.ts` holds the site URL (`https://elvisbrevi.cl`), name, description and social links, shared by the app and the build.

## Content loading (critical)

### Blog posts
Posts live in `/posts/` (source) and are found by filename: every `posts/YYYY-MM-DD-slug.md` is a post, served at `/post/YYYY-MM-DD-slug` (the slug allows lowercase letters, digits and hyphens). There is no list to edit. `scripts/post-files.ts` lists them newest first; `scripts/vite-plugin-site.ts` serves that list to the app as the `virtual:post-files` module (typed in `src/vite-env.d.ts`) and uses it for the build's pages, feed and sitemap. A `.md` that doesn't match the pattern is left out with a warning; a post missing `title`, `date` or `description` is still published, also with a warning.

`scripts/copy-posts.mjs` mirrors `posts/` into `/public/posts/` (served), removing copies of deleted posts, via the `predev` and `prebuild` hooks. While `npm run dev` runs, the plugin keeps that copy in sync and reloads the page when a post is added, edited or removed. `public/posts/` is tracked in git, so commit it together with `posts/`.

**To add a new post:**
1. Create `posts/YYYY-MM-DD-slug.md` with `title`, `date`, `description` (one sentence; it's the list excerpt and the meta description), `tags` and `cover` in the front matter
2. If it has a cover, add a 352px-wide copy to `public/images/covers/thumbs/` with the same name for the post list: `convert cover.webp -resize 352x -strip -quality 78 thumbs/cover.webp` (without it the list falls back to the full cover)

To remove or rename a post, delete or rename its file in `posts/`. The post page already shows the title, so the leading `# Title` line in the markdown is not rendered.

### Static pages
Static pages (about, side-projects) are `.md` files in `public/static-pages/`, with `title` and `description` front matter. Each page component hardcodes the filename it loads (e.g. `loadStaticPage('about.md')` in `src/pages/about/about.tsx`). To add a new static page: add the `.md` to `public/static-pages/`, add a route in `src/app.tsx`, create a page component that calls `loadStaticPage`, and add its name to `STATIC_PAGES` in `scripts/vite-plugin-site.ts`.

`public/static-pages/home-intro.md` exists but has no route — currently unused. The home intro is written in `src/pages/blog/blog.tsx`.

### Generated at build time
`scripts/vite-plugin-site.ts` fills the `<!-- site-meta -->` placeholder in `index.html` (title, description, canonical, Open Graph/Twitter tags) and, on build, writes `post/<slug>.html`, `about.html` and `side-projects.html` (index.html with that page's tags and preloads; link previews don't run JavaScript, and Cloudflare Pages serves them at `/post/<slug>` etc.), plus `rss.xml`, `sitemap.xml` and `robots.txt`.

## Quirks

- **Buffer polyfill**: `gray-matter` needs Node's `Buffer`. Vite config aliases `buffer` and sets `global: 'globalThis'`. `src/services/front-matter.ts` sets `window.Buffer = Buffer`. Do not remove. Both content services import that module dynamically, so gray-matter loads in parallel with the first markdown file instead of delaying the first render.
- **Markdown rendering**: `src/services/markdown-service.ts` renders with `marked` and custom renderers: every `<img>` is wrapped in an `<a data-fancybox>` (lazy-loaded image) so Fancybox can show a lightbox on click, and code blocks get a language label and a copy button. Posts also pass `highlightCode` from `src/services/highlight.ts` (highlight.js core with the Nord theme; only the registered languages are bundled — register new ones there). Cheerio used to post-process the HTML, but with its dependencies it was ~600 KB unminified (close to half of the old bundle, not ~7 KB), so the renderers replaced it.
- **Fancybox** stays vendored in `public/js/fancybox.umd.js` + `public/css/fancybox.css`; `src/services/lightbox.ts` loads them the first time a page with images is rendered.
- **Fonts and icons**: IBM Plex Mono is self-hosted from `@fontsource/ibm-plex-mono` (`src/fonts/fonts.css`, weights 400, 400 italic and 600); headings use the system serif stack. Icons are inline SVGs from Bootstrap Icons in `src/components/icons/icons.tsx` — no Google Fonts or icon font.
- **Caching**: `public/_headers` makes Cloudflare Pages cache the fingerprinted files in `/assets/` for a year.
- **No tests and no CI**, on purpose (see the GitHub Actions rule under Commands).
- **`server.fs.allow: ['..']`** in Vite config allows dev server to read from parent directories.

- **CSS**: plain CSS with custom properties. No Tailwind, no CSS modules. Warm off-white theme (`#F5F3EE`). All transitions are disabled globally (`* { transition: none; }`). Lazy pages bring their own CSS, so scope selectors to the component (e.g. `.post-list .post-title`) to avoid one page's styles leaking into another after navigation.
- **`@types/marked` is v5** but `marked` is v16 — the types are intentionally pinned to v5 for compatibility.
