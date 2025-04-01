import './post-body.css';
import { useEffect, useState } from 'react';
import * as cheerio from 'cheerio';
import { Loading } from '../loading/loading';
import type { PostData } from '../../interfaces/PostData';

const PostBody = ( post : PostData) => {

    const [postContent, setPostContent] = useState<string>("");
    useEffect(() => {
        // Add copy button to code blocks
        var postContent = post.content.html.replace(
            /<pre><code/g,
            '<pre><span class="btn-copy-code">COPY<i className="bi bi-clipboard"></i></span><code');
        postContent = replaceImgWithLink(postContent);
        setPostContent(postContent);
    }, []);

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
