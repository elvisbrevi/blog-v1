// Site-wide metadata shared by the app and the build (vite.config.ts uses it
// to write the RSS feed, the sitemap and each page's <head> tags).
export const SITE = {
  name: 'Elvis Brevi',
  url: 'https://elvisbrevi.cl',
  description:
    'Notes, write-ups and side projects by Elvis Brevi, a full-stack developer exploring Rust, C# and the cloud.',
};

export const SOCIAL_LINKS = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/elvisbrevi/' },
  { id: 'github', label: 'GitHub', url: 'https://github.com/elvisbrevi' },
  { id: 'twitter', label: 'X', url: 'https://x.com/elvisbrevi' },
] as const;

export function pageTitle(title?: string): string {
  return title && title !== SITE.name ? `${title} · ${SITE.name}` : SITE.name;
}
