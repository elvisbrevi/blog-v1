import matter from 'gray-matter';

export interface StaticPage {
    title: string;
    slug: string;
    content: string;
}

export async function parseStaticPage(markdownContent: string, filename: string): Promise<StaticPage> {
    const { data, content } = matter(markdownContent);
    
    const slug = filename.replace(/\.md$/, '');
    
    return {
        title: data.title || '',
        slug,
        content: content
    };
}

export async function loadStaticPage(filename: string): Promise<StaticPage | null> {
    try {
        const response = await fetch(`/static-pages/${filename}`);
        if (!response.ok) {
            console.warn(`Could not load page: ${filename}`);
            return null;
        }
        const fileContent = await response.text();
        return parseStaticPage(fileContent, filename);
    } catch (error) {
        console.warn(`Error loading page ${filename}:`, error);
        return null;
    }
}
