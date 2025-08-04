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
            // Convert markdown to HTML
            const htmlContent = await marked(post.content);
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
