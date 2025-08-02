import './post-body.css';
import { useEffect, useState } from 'react';
import * as cheerio from 'cheerio';
import { Loading } from '../loading/loading';
import { BlogPost } from '../../services/blog-service';

const PostBody = ( post : BlogPost) => {

    const [postContent, setPostContent] = useState<string>("");
    useEffect(() => {
        // For now, display markdown content as-is
        // In a real implementation, you'd convert markdown to HTML here
        const htmlContent = post.content.replace(/\n/g, '<br>');
        const finalContent = replaceImgWithLink(htmlContent);
        setPostContent(finalContent);
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
