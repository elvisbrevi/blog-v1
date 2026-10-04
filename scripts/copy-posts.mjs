import { copyFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const srcDir = resolve(root, 'posts');
const destDir = resolve(root, 'public', 'posts');

if (!existsSync(srcDir)) {
  console.error('Source posts directory not found:', srcDir);
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

const markdownFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name);

const posts = markdownFiles(srcDir);
for (const name of posts) {
  copyFileSync(resolve(srcDir, name), resolve(destDir, name));
}

// Remove the copies of posts that were deleted or renamed in posts/.
const removed = markdownFiles(destDir).filter((name) => !posts.includes(name));
for (const name of removed) {
  rmSync(resolve(destDir, name));
}

console.log(
  `Copied ${posts.length} posts to public/posts/` +
    (removed.length ? `, removed ${removed.join(', ')}` : '')
);
