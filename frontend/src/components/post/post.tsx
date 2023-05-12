import { useEffect, useState } from 'preact/hooks';

interface Post {
    title: string;
    slug: string;
    cuid: string;
    coverImage: string;
    content: string;
    contentMarkdown: string;
}

const Post: preact.ComponentType = () => {
    
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        async function fetchDataAsync() {
            // const params = new URLSearchParams(window.location.pathname);
            // let slug : string | null = params.get("slug") || null;
            const postData = await fetchData("how-to-display-hashnode-posts-on-your-website");
            setPost(postData);
        }

        fetchDataAsync();
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
};

async function fetchData(slug: string): Promise<Post> {

    const query = `
        {
            post(slug:"${slug}", hostname:"elvisbrevi.hashnode.dev") {
                title,
                slug,
                cuid,
                coverImage,
                content,
                contentMarkdown
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
    return data.post;
}

export default Post;
