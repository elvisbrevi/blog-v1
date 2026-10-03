import { POST_FILES } from './post-files';

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  cover: string;
  content: string;
  readingTime: number;
}

export interface AdjacentPosts {
  newer: BlogPost | null;
  older: BlogPost | null;
}

const WORDS_PER_MINUTE = 200;

// Extract date from filename (format: YYYY-MM-DD-title.md)
function dateFromFilename(filename: string): string {
  return filename.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? '';
}

// Newest first, by the date in the filename.
const SORTED_FILES = [...POST_FILES].sort((a, b) =>
  dateFromFilename(b).localeCompare(dateFromFilename(a))
);

export async function parseMarkdownPost(markdownContent: string, filename: string): Promise<BlogPost> {
  const { default: matter } = await import('./front-matter');
  const { data, content } = matter(markdownContent);

  // Extract slug from filename (remove .md extension)
  const slug = filename.replace(/\.md$/, '');

  // Unquoted YAML dates are parsed as Date objects.
  const date = data.date instanceof Date ? data.date.toISOString() : data.date;
  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    title: data.title || '',
    slug,
    date: date || dateFromFilename(filename),
    description: data.description || '',
    tags: data.tags || [],
    cover: data.cover || '',
    content: content,
    readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  };
}

// Each post is fetched at most once per page load. The list, the post page and
// the previous/next links share these promises, which also keeps them stable
// for React's use().
const postRequests = new Map<string, Promise<BlogPost | null>>();
const adjacentRequests = new Map<string, Promise<AdjacentPosts>>();
const NOT_FOUND: Promise<null> = Promise.resolve(null);
let allPosts: Promise<BlogPost[]> | undefined;

function fetchPost(filename: string): Promise<BlogPost | null> {
  let request = postRequests.get(filename);
  if (!request) {
    // Start downloading the front matter parser alongside the post.
    import('./front-matter').catch(() => {});
    request = fetch(`/posts/${filename}`)
      .then(async (response) => {
        // A missing file is answered with the SPA's index.html on Cloudflare Pages.
        if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
          console.warn(`Could not load post: ${filename}`);
          return null;
        }
        return parseMarkdownPost(await response.text(), filename);
      })
      .catch((error) => {
        console.warn(`Error loading post ${filename}:`, error);
        return null;
      });
    postRequests.set(filename, request);
  }
  return request;
}

export function loadBlogPosts(): Promise<BlogPost[]> {
  allPosts ??= Promise.all(SORTED_FILES.map(fetchPost)).then((posts) =>
    posts.filter((post): post is BlogPost => post !== null)
  );
  return allPosts;
}

export function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filename = `${slug}.md`;
  return POST_FILES.includes(filename) ? fetchPost(filename) : NOT_FOUND;
}

// The posts published right after and right before the given one.
export function getAdjacentPosts(slug: string): Promise<AdjacentPosts> {
  let request = adjacentRequests.get(slug);
  if (!request) {
    const index = SORTED_FILES.indexOf(`${slug}.md`);
    const newer = index > 0 ? SORTED_FILES[index - 1] : undefined;
    const older = index >= 0 ? SORTED_FILES[index + 1] : undefined;
    request = Promise.all([
      newer ? fetchPost(newer) : null,
      older ? fetchPost(older) : null
    ]).then(([newer, older]) => ({ newer, older }));
    adjacentRequests.set(slug, request);
  }
  return request;
}
