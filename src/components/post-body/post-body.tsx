import './post-body.css';
import { useEffect, useState } from 'react';
import * as cheerio from 'cheerio';
import { marked } from 'marked';
import { Loading } from '../loading/loading';
import { BlogPost } from '../../services/blog-service';

const PostBody = ( post : BlogPost) => {

    const [postContent, setPostContent] = useState<string>("");
    useEffect(() => {
        async function processMarkdown() {
            // Clean markdown content before processing
            const cleanedMarkdown = cleanMarkdownImages(post.content);

            // Convert markdown to HTML
            const htmlContent = await marked(cleanedMarkdown);
            const finalContent = replaceImgWithLink(htmlContent);
            setPostContent(finalContent);
        }

        processMarkdown();
    }, [post.content]);

    if (!post) {
        return <Loading />;
    }

    return (
        <div className="post-body" dangerouslySetInnerHTML={{ __html: postContent }} />
    );
};

function cleanMarkdownImages(markdown: string): string {
    // Remove HTML attributes from markdown image syntax
    // Example: ![alt](url align="center") -> ![alt](url)
    let cleaned = markdown.replace(/!\[(.*?)\]\((.*?)\s+align=["'].*?["']\)/g, '![$1]($2)');

    // Also handle any other HTML attributes within markdown image syntax
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

export default PostBody;
