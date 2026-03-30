import './markdown-page.css';
import { useEffect, useState } from 'react';
import * as cheerio from 'cheerio';
import { marked } from 'marked';
import { Loading } from '../loading/loading';
import { StaticPage } from '../../services/static-pages-service';

interface MarkdownPageProps {
    page: StaticPage | null;
}

const MarkdownPage = ({ page }: MarkdownPageProps) => {
    const [content, setContent] = useState<string>("");

    useEffect(() => {
        async function processMarkdown() {
            if (!page?.content) return;
            
            const cleanedMarkdown = cleanMarkdownImages(page.content);
            const htmlContent = await marked.parse(cleanedMarkdown);
            const finalContent = replaceImgWithLink(htmlContent);
            setContent(finalContent);
        }

        processMarkdown();
    }, [page?.content]);

    if (!page) {
        return <Loading />;
    }

    return (
        <div className="markdown-page" dangerouslySetInnerHTML={{ __html: content }} />
    );
};

function cleanMarkdownImages(markdown: string): string {
    let cleaned = markdown.replace(/!\[(.*?)\]\((.*?)\s+align=["'].*?["']\)/g, '![$1]($2)');
    cleaned = cleaned.replace(/!\[(.*?)\]\((.*?)\s+\w+=["'].*?["']\)/g, '![$1]($2)');
    return cleaned;
}

function replaceImgWithLink(html: string): string {
    const $ = cheerio.load(html);
  
    $('img').each((_, element) => {
        const imgSrc = $(element).attr('src');
        const newLink = $('<a>')
            .attr('href', `${imgSrc}`)
            .attr('data-fancybox', '')
            .append($(element).clone());

        $(element).replaceWith(newLink);
    });
  
    return $.html();
}

export default MarkdownPage;
