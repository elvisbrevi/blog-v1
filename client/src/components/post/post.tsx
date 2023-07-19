import './post.css';
import { useEffect, useState } from 'preact/hooks';
import * as cheerio from 'cheerio';

interface Post {
    title: string;
    slug: string;
    cuid: string;
    coverImage: string;
    content: string;
    contentMarkdown: string;
    dateAdded: string;
}

const Post = () => {
    
    const [post, setPost] = useState<Post | null>(null);

    // Fetch post data from Hashnode API
    useEffect(() => {

        async function fetchDataAsync() {
            const postData = await fetchData();
            setPost(postData);
        }

        fetchDataAsync();
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div class="post-content">
            <span class="post-date">{post.dateAdded.substring(0, 10)}</span>
            <h1 class="post-title">{post.title}</h1>
            <img class="post-featured-image" width={500} src={post.coverImage} />
            <div class="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
};

async function fetchData(): Promise<Post> {

    // Get post slug from URL
    let slug : string | null = window.location.pathname.split("/").slice(-1)[0] || null;

    // Get post data from Hashnode API
    const query = `
        {
            post(slug:"${slug}", hostname:"elvisbrevi.hashnode.dev") {
                title,
                slug,
                cuid,
                coverImage,
                content,
                dateAdded
            }
        }
    `;
  
    const response = await fetch("https://api.hashnode.com", {
        method: "post",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });

    const { data } = await response.json();

    // Add copy button to code blocks
    data.post.content = data.post.content.replace(
        /<pre><code/g, 
        '<pre><span class="btn-copy-code">COPY<i class="bi bi-clipboard"></i></span><code');

    data.post.content = replaceImgWithLink(data.post.content);

    return data.post;
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

export default Post;
