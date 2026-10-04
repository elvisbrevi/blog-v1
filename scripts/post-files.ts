import { readdirSync } from 'node:fs';

// A post is a markdown file in posts/ named YYYY-MM-DD-slug.md. Its URL is
// /post/<name without .md>, so the slug is limited to lowercase letters,
// digits and hyphens.
export const POST_FILE_PATTERN = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

export interface PostFiles {
  // Newest first: the names start with the date.
  files: string[];
  // Markdown files in posts/ that don't follow the naming pattern.
  ignored: string[];
}

export function listPostFiles(postsDir: string): PostFiles {
  const files: string[] = [];
  const ignored: string[] = [];
  for (const entry of readdirSync(postsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    (POST_FILE_PATTERN.test(entry.name) ? files : ignored).push(entry.name);
  }
  files.sort().reverse();
  ignored.sort();
  return { files, ignored };
}

export function ignoredPostsWarning(ignored: string[]): string {
  return (
    `Ignoring ${ignored.join(', ')} in posts/: post files must be named ` +
    'YYYY-MM-DD-slug.md, with a slug of lowercase letters, digits and hyphens.'
  );
}
