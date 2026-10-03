# AGENTS.md

## Commands

```sh
npm run dev        # Vite dev server
npm run build      # typecheck (tsc -b) then bundle (vite build)
npm run lint       # ESLint flat config
npm run preview    # Vite preview (production build preview)
```

Build runs `tsc -b` first — type errors block the bundle.

## Architecture

**Client-side SPA** — React 19 + React Router v7 + TypeScript 5.7, bundled with Vite 6. No SSR/SSG. No database. All content is markdown files loaded at runtime via `fetch()`. Deployed on Cloudflare Pages (every branch gets a preview URL).

- **Routing**: `createBrowserRouter` in `src/app.tsx`. Internal links must use React Router's `<Link>`/`<NavLink>` (a plain `<a href>` reloads the whole app). `<ScrollRestoration>` restores the scroll position on back/forward.
- **Code splitting**: the post, about and side-projects pages are `lazy()` routes, so the post list doesn't download `marked` or highlight.js.
- **Data loading**: services return cached promises (one request per file per page load) that pages read with React's `use()` inside `<Suspense>`. Keep returning the same promise for the same input, or `use()` suspends forever.
- **Site metadata**: `src/site.ts` holds the site URL (`https://elvisbrevi.com`), name, description and social links, shared by the app and the build.

## Content loading (critical)

### Blog posts
Posts live in `/posts/` (source). `scripts/copy-posts.mjs` copies them to `/public/posts/` (served) automatically via `predev` and `prebuild` hooks. The list of post filenames is hardcoded in the `POST_FILES` array in `src/services/post-files.ts`, which both the app and the build read.

**To add a new post:**
1. Create the `.md` file in `posts/`, with `title`, `date`, `description` (one sentence; it's the list excerpt and the meta description), `tags` and `cover` in the front matter
2. Add the filename to `POST_FILES` in `src/services/post-files.ts`
3. If it has a cover, add a 352px-wide copy to `public/images/covers/thumbs/` with the same name for the post list: `convert cover.webp -resize 352x -strip -quality 78 thumbs/cover.webp` (without it the list falls back to the full cover)

The copy to `public/posts/` is handled automatically by `npm run dev` / `npm run build`. The post page already shows the title, so the leading `# Title` line in the markdown is not rendered.

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
- **No tests, no CI**: nothing in `.github/workflows/`.
- **`server.fs.allow: ['..']`** in Vite config allows dev server to read from parent directories.

- **CSS**: plain CSS with custom properties. No Tailwind, no CSS modules. Warm off-white theme (`#F5F3EE`). All transitions are disabled globally (`* { transition: none; }`). Lazy pages bring their own CSS, so scope selectors to the component (e.g. `.post-list .post-title`) to avoid one page's styles leaking into another after navigation.
- **`@types/marked` is v5** but `marked` is v16 — the types are intentionally pinned to v5 for compatibility.
