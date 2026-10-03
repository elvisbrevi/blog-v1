import { useEffect } from 'react';
import { pageTitle, SITE } from '../site';

// Keeps the tab title and meta description in sync on client-side navigation.
// The HTML served for each page already has them (generated in vite.config.ts).
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = pageTitle(title);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description || SITE.description);
  }, [title, description]);
}
