import './post-list.css';
import { useEffect, useState } from 'preact/hooks';

interface Post {
    title: string;
    brief: string;
    slug: string;
    cuid: string;
}

const PostList: preact.ComponentType = () => {

    const [posts, setPosts] = useState<Post[] | null>(null); // Initialize with null

  useEffect(() => {
    async function fetchDataAsync() {
      const postsData = await fetchData();
      setPosts(postsData);
    }

    fetchDataAsync();
  }, []);

  if (posts === null) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>{post.title}</li>
      ))}
    </ul>
  );
};

async function fetchData(): Promise<Post[]> {
    const query = `
      {
        user(username:"elvisbrevi") {
          publication {
            posts {
              title
              brief
              slug
              cuid
            }
          }
        }
      }
    `;
  
    const response = await fetch("https://api.hashnode.com", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
  
    const { data } = await response.json();
    return data.user.publication.posts;
  }

export default PostList;