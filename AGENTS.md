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
1. Create `posts/YYYY-MM-DD-slug.md` with `title`, `date`, `description` (one sentence; it's the list excerpt, the italic lede under the post title and the meta description), `tags` and `cover` in the front matter
2. If it has a cover (an 800×457 WebP illustration in the site's print style, see Design), add a 352px-wide copy to `public/images/covers/thumbs/` with the same name for the post list: `convert cover.webp -resize 352x -strip -quality 78 thumbs/cover.webp` (without it the list falls back to the full cover)

Posts are numbered in publication order (`No. 01` is the oldest, see `postNumber()` in `src/services/blog-service.ts`); the newest one gets the wide card at the top of the list.

To remove or rename a post, delete or rename its file in `posts/`. The post page already shows the title, so the leading `# Title` line in the markdown is not rendered.

### Static pages
Static pages (about, side-projects) are `.md` files in `public/static-pages/`, with `title` and `description` front matter. Each page component hardcodes the filename it loads (e.g. `loadStaticPage('about.md')` in `src/pages/about/about.tsx`). To add a new static page: add the `.md` to `public/static-pages/`, add a route in `src/app.tsx`, create a page component that calls `loadStaticPage`, and add its name to `STATIC_PAGES` in `scripts/vite-plugin-site.ts`.

`side-projects.md` is an introduction followed by one `## [Name](url)` section per project: `src/pages/side-projects/side-projects.tsx` splits it there and renders each section as a numbered card.

`public/static-pages/home-intro.md` exists but has no route — currently unused. The home intro is written in `src/pages/blog/blog.tsx`.

### Generated at build time
`scripts/vite-plugin-site.ts` fills the `<!-- site-meta -->` placeholder in `index.html` (title, description, canonical, Open Graph/Twitter tags; pages without a cover use `public/images/og-card.jpg`) and, on build, writes `post/<slug>.html`, `about.html` and `side-projects.html` (index.html with that page's tags and preloads; link previews don't run JavaScript, and Cloudflare Pages serves them at `/post/<slug>` etc.), plus `rss.xml`, `sitemap.xml` and `robots.txt`.

## Quirks

- **Buffer polyfill**: `gray-matter` needs Node's `Buffer`. Vite config aliases `buffer` and sets `global: 'globalThis'`. `src/services/front-matter.ts` sets `window.Buffer = Buffer`. Do not remove. Both content services import that module dynamically, so gray-matter loads in parallel with the first markdown file instead of delaying the first render.
- **Markdown rendering**: `src/services/markdown-service.ts` renders with `marked` and custom renderers: every `<img>` is wrapped in an `<a data-fancybox>` (lazy-loaded image) so Fancybox can show a lightbox on click, and code blocks get a language label and a copy button. Posts also pass `highlightCode` from `src/services/highlight.ts` (highlight.js core with the palette theme in `src/themes/syntax.css`; only the registered languages are bundled — register new ones there). Cheerio used to post-process the HTML, but with its dependencies it was ~600 KB unminified (close to half of the old bundle, not ~7 KB), so the renderers replaced it.
- **Fancybox** stays vendored in `public/js/fancybox.umd.js` + `public/css/fancybox.css`; `src/services/lightbox.ts` loads them the first time a page with images is rendered.
- **Fonts and icons**: self-hosted from `@fontsource` (`src/fonts/fonts.css`): Dela Gothic One for display type, Newsreader (400, 400 italic, 600) for reading text and IBM Plex Mono (400, 600) for labels, navigation and code. Only the kana chunk of Dela Gothic One's Japanese subset is included, for the decorative Japanese; kanji would fall back to the system font. Icons are inline SVGs from Bootstrap Icons in `src/components/icons/icons.tsx` — no Google Fonts or icon font.
- **Caching**: `public/_headers` makes Cloudflare Pages cache the fingerprinted files in `/assets/` for a year.
- **No tests and no CI**, on purpose (see the GitHub Actions rule under Commands).
- **`server.fs.allow: ['..']`** in Vite config allows dev server to read from parent directories.

- **CSS**: plain CSS with custom properties. No Tailwind, no CSS modules. Tokens live in `src/themes/theme.css` (see Design); use the semantic ones (`--bg`, `--surface`, `--text`, `--text-soft`, `--text-muted`, `--border`...) rather than raw colors. Shared pieces (`.container`, `.label`, `.pill`, `.button`, `.jp-vertical`, code blocks) are in `src/index.css`; rendered markdown is styled by `src/themes/prose.css` (`.prose`). All transitions are disabled globally (`* { transition: none; }`), so hover states change instantly. Lazy pages bring their own CSS, so scope selectors to the component (e.g. `.post-list .post-card-title`) to avoid one page's styles leaking into another after navigation.
- **`@types/marked` is v5** but `marked` is v16 — the types are intentionally pinned to v5 for compatibility.

## Design

Showa-era Japanese print: cream paper, indigo ink, salmon and peach, like a 1970s screen-printed poster or a risograph zine. Editorial touches: numbered posts and sections (`No. 01`, `Part. 01`), small uppercase mono labels (`× NOTES × RUST ×`), dark pills, cards that lift with a hard ink shadow on hover, a scalloped (wave) footer.

- **Palette** (`src/themes/theme.css`): cream `#FFF5E0`, peach `#FFDBC3`, salmon `#EE9E8E`, indigo `#190933`, plus vermilion `#D9482B`, sage `#9DAA7C` and mustard `#E9A93B` as small accents. Salmon, vermilion, sage and mustard don't reach 4.5:1 on cream: use them for shapes and large display type only; text uses the `--text*` and `--accent-text` tokens, which meet WCAG AA. The dark theme ("night") turns the indigo into the paper. A tiled SVG noise (`--grain` in `src/index.css`) gives the background a paper grain.
- **Decorative Japanese** (ブログ, プロフィール, ありがとう...) is always `aria-hidden="true"` and `lang="ja"`, with a comment giving its meaning. Keep it to kana so it renders with the bundled font.
- **Illustrations** live in `public/images/art/` in two widths (`name-<w>.webp` and twice that) for `srcset`. They show Elvis, drawn from reference photos in the same style: no hat or cap, no rosy cheeks, natural everyday expressions. Post covers follow the same style. They were generated with Codex's image generation using the user's reference images for style; to keep new ones consistent, describe the post's subject and append: "vintage Japanese screen-print / risograph poster illustration (Showa-era 1960s-70s print aesthetic), flat bold shapes, slightly misregistered ink layers, visible paper grain and subtle halftone dots; palette: deep indigo-black #190933, salmon #EE9E8E, peach #FFDBC3, cream paper #FFF5E0, small touches of vermilion #D9482B and sage #9DAA7C; no text, no logos, no famous or copyrighted characters". Generate landscape and crop the center to 800×457.
- **Brand**: the header seal and the favicons (`public/images/favicon*`, `android-chrome-*`, `apple-touch-icon.png`) are a vermilion hanko with "ブレビ" (Brevi); `public/images/og-card.jpg` is the 1200×630 social card.
