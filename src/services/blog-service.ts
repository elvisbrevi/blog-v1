import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Make Buffer available globally for gray-matter
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  cover: string;
  content: string;
}

// List of post files - update this when adding new posts
const POST_FILES = [
  '2023-07-05-static-web-page-with-continuous-deployment-and-iac.md',
  '2023-10-14-improving-nodejs-with-rust-wasm-library.md',
  '2023-12-05-advent-of-code-2015-day-1-not-quite-lisp.md',
  '2023-12-06-advent-of-code-2015-day-2-i-was-told-there-would-be-no-math.md',
  '2023-12-07-advent-of-code-2015-day-3-perfectly-spherical-houses-in-a-vacuum.md',
  '2023-12-11-advent-of-code-2015-day-4-the-ideal-stocking-stuffer.md',
  '2023-12-12-advent-of-code-2015-day-5-doesnt-he-have-intern-elves-for-this.md',
  '2023-12-15-advent-of-code-2015-day-6-probably-a-fire-hazard.md',
  '2023-12-20-advent-of-code-2015-day-7-some-assembly-required.md',
  '2024-01-20-advent-of-code-2015-day-8-matchsticks.md'
];

export async function parseMarkdownPost(markdownContent: string, filename: string): Promise<BlogPost> {
  const { data, content } = matter(markdownContent);
  
  // Extract slug from filename (remove .md extension)
  const slug = filename.replace(/\.md$/, '');
  
  // Extract date from filename (format: YYYY-MM-DD-title.md)
  const dateFromFilename = filename.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  
  return {
    title: data.title || '',
    slug,
    date: data.date || dateFromFilename || '',
    description: data.description || '',
    tags: data.tags || [],
    cover: data.cover || '',
    content: content
  };
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await Promise.all(
      POST_FILES.map(async (filename) => {
        try {
          const response = await fetch(`/posts/${filename}`);
          if (!response.ok) {
            console.warn(`Could not load post: ${filename}`);
            return null;
          }
          const fileContent = await response.text();
          return parseMarkdownPost(fileContent, filename);
        } catch (error) {
          console.warn(`Error loading post ${filename}:`, error);
          return null;
        }
      })
    );
    
    // Filter out failed loads and sort by date from filename (descending order - newest first)
    return posts
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => {
        const dateA = a.slug.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || a.date;
        const dateB = b.slug.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || b.date;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}