import './markdown-page.css';
import { useEffect, useMemo, useRef } from 'react';
import { StaticPage } from '../../services/static-pages-service';
import { handleCodeCopy, renderMarkdown } from '../../services/markdown-service';
import { enableLightbox } from '../../services/lightbox';

interface MarkdownPageProps {
    page: StaticPage | null;
}

const MarkdownPage = ({ page }: MarkdownPageProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const content = useMemo(() => (page?.content ? renderMarkdown(page.content) : ''), [page?.content]);

    useEffect(() => {
        enableLightbox(ref.current);
    }, [content]);

    if (!page) {
        return <p className="markdown-page-error">This page could not be loaded. Please try again later.</p>;
    }

    return (
        <div
            ref={ref}
            className="markdown-page"
            onClick={handleCodeCopy}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default MarkdownPage;
