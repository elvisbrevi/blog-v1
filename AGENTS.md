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

**Client-side SPA** — React 19 + React Router v7 + TypeScript 5.7, bundled with Vite 6. No SSR/SSG. No database. All content is markdown files loaded at runtime via `fetch()`.

## Content loading (critical)

### Blog posts
Posts live in `/posts/` (source). `scripts/copy-posts.mjs` copies them to `/public/posts/` (served) automatically via `predev` and `prebuild` hooks. The blog service hardcodes the list of post filenames in `src/services/blog-service.ts:20` in the `POST_FILES` array.

**To add a new post:**
1. Create the `.md` file in `posts/`
2. Add the filename to `POST_FILES` in `src/services/blog-service.ts`

The copy to `public/posts/` is handled automatically by `npm run dev` / `npm run build`.

### Static pages
Static pages (about, side-projects) are `.md` files in `public/static-pages/`. Each page component hardcodes the filename it loads (e.g. `loadStaticPage('about.md')` at `src/pages/about/about.tsx:14`). To add a new static page: add the `.md` to `public/static-pages/`, add a route in `src/app.tsx`, and create a page component that calls `loadStaticPage`.

`public/static-pages/home-intro.md` exists but has no route — currently unused.

## Quirks

- **Buffer polyfill**: `gray-matter` needs Node's `Buffer`. Vite config aliases `buffer` and sets `global: 'globalThis'`. `blog-service.ts` sets `window.Buffer = Buffer`. Do not remove.
- **Cheerio runs in the browser**: `PostBody` and `MarkdownPage` parse HTML with Cheerio after `marked` renders markdown, wrapping every `<img>` in an `<a data-fancybox>` so Fancybox can show a lightbox on click. The same `replaceImgWithLink` function is duplicated in both components (`src/components/post-body/post-body.tsx:45`, `src/components/markdown-page/markdown-page.tsx:43`). Alternatives like `DOMParser` or regex were not chosen — Cheerio (jQuery-like API, ~7KB gzipped) keeps the manipulation readable.
- **No tests, no CI**: nothing in `.github/workflows/`.
- **`server.fs.allow: ['..']`** in Vite config allows dev server to read from parent directories.

- **CSS**: plain CSS with custom properties. No Tailwind, no CSS modules. Warm off-white theme (`#F5F3EE`). All transitions are disabled globally (`* { transition: none; }`).
- **`@types/marked` is v5** but `marked` is v16 — the types are intentionally pinned to v5 for compatibility.
