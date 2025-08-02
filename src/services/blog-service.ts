import matter from 'gray-matter';

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  cover: string;
  content: string;
}

export async function parseMarkdownPost(markdownContent: string, filename: string): Promise<BlogPost> {
  const { data, content } = matter(markdownContent);
  
  // Extract slug from filename (remove .md extension)
  const slug = filename.replace(/\.md$/, '');
  
  return {
    title: data.title || '',
    slug,
    date: data.date || '',
    description: data.description || '',
    tags: data.tags || [],
    cover: data.cover || '',
    content: content
  };
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  // This will be updated to read from actual markdown files
  // For now, return mock data to maintain functionality
  return [
    {
      title: "Improving Node.js with Rust-Wasm Library",
      slug: "improving-nodejs-with-rust-wasm-library",
      date: "2023-10-12 16:00:00",
      description: "Learn how to enhance Node.js applications using Rust-Wasm libraries for better performance and memory safety.",
      tags: ["Node.js", "Rust", "WebAssembly", "wasm-bindgen", "Performance"],
      cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1697222302376",
      content: "# Improving Node.js with Rust-Wasm Library\n\nContent here..."
    }
  ];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}