import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
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

const files = readdirSync(srcDir, { withFileTypes: true });
let count = 0;

for (const entry of files) {
  if (entry.isFile() && entry.name.endsWith('.md')) {
    copyFileSync(resolve(srcDir, entry.name), resolve(destDir, entry.name));
    count++;
  }
}

console.log(`Copied ${count} posts to public/posts/`);
