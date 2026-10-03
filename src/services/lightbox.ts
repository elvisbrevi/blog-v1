// Fancybox (public/js/fancybox.umd.js) is only needed on pages that have
// images, so it is loaded the first time one is rendered instead of on every page.
declare global {
  interface Window {
    Fancybox?: { bind: (selector: string, options?: Record<string, unknown>) => void };
  }
}

let fancybox: Promise<void> | undefined;

function loadFancybox(): Promise<void> {
  fancybox ??= new Promise<void>((resolve, reject) => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/css/fancybox.css';
    document.head.append(style);

    const script = document.createElement('script');
    script.src = '/js/fancybox.umd.js';
    script.onload = () => {
      // Delegated binding: it also covers images rendered later.
      window.Fancybox?.bind('[data-fancybox]', {});
      resolve();
    };
    script.onerror = () => {
      fancybox = undefined;
      reject(new Error('Could not load Fancybox'));
    };
    document.head.append(script);
  });
  return fancybox;
}

export function enableLightbox(container: HTMLElement | null) {
  if (container?.querySelector('[data-fancybox]')) {
    loadFancybox().catch((error) => console.warn(error));
  }
}
