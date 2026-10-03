import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Make Buffer available globally for gray-matter
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Imported dynamically by blog-service.ts and static-pages-service.ts, so
// gray-matter and the Buffer polyfill download in parallel with the first
// markdown file instead of delaying the first render.
export default matter;
