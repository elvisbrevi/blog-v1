import './post-body.css';
import { useEffect, useMemo, useRef } from 'react';
import { BlogPost } from '../../services/blog-service';
import { handleCodeCopy, renderMarkdown, stripLeadingTitle } from '../../services/markdown-service';
import { highlightCode } from '../../services/highlight';
import { enableLightbox } from '../../services/lightbox';

const PostBody = (post: BlogPost) => {
    const ref = useRef<HTMLDivElement>(null);

    // The page renders the title above the cover, so drop the copy in the markdown.
    const postContent = useMemo(
        () => renderMarkdown(stripLeadingTitle(post.content, post.title), { highlight: highlightCode }),
        [post.content, post.title]
    );

    useEffect(() => {
        enableLightbox(ref.current);
    }, [postContent]);

    return (
        <div
            ref={ref}
            className="post-body"
            onClick={handleCodeCopy}
            dangerouslySetInnerHTML={{ __html: postContent }}
        />
    );
};

export default PostBody;
