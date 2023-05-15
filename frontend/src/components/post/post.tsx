import { useEffect, useState } from 'preact/hooks';

interface Post {
    title: string;
    slug: string;
    cuid: string;
    coverImage: string;
    content: string;
    contentMarkdown: string;
}

const Post = () => {
    
    const [post, setPost] = useState<Post | null>(null);

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
        <div>
            <h1>{post.title}</h1>
            <img width={500} src={post.coverImage} />
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
};

async function fetchData(): Promise<Post> {

    //const params = new URLSearchParams(window.location.pathname);
    let slug : string | null = "how-to-display-hashnode-posts-on-your-website";//params.get("slug") || null;

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
