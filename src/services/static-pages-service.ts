export interface StaticPage {
    title: string;
    slug: string;
    description: string;
    content: string;
}

export async function parseStaticPage(markdownContent: string, filename: string): Promise<StaticPage> {
    const { default: matter } = await import('./front-matter');
    const { data, content } = matter(markdownContent);

    const slug = filename.replace(/\.md$/, '');

    return {
        title: data.title || '',
        slug,
        description: data.description || '',
        content: content
    };
}

// Cached so revisiting a page renders instantly and React's use() gets a stable promise.
const pageRequests = new Map<string, Promise<StaticPage | null>>();

export function loadStaticPage(filename: string): Promise<StaticPage | null> {
    let request = pageRequests.get(filename);
    if (!request) {
        // Start downloading the front matter parser alongside the page.
        import('./front-matter').catch(() => {});
        request = fetch(`/static-pages/${filename}`)
            .then(async (response) => {
                if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
                    console.warn(`Could not load page: ${filename}`);
                    return null;
                }
                return parseStaticPage(await response.text(), filename);
            })
            .catch((error) => {
                console.warn(`Error loading page ${filename}:`, error);
                return null;
            });
        pageRequests.set(filename, request);
    }
    return request;
}
