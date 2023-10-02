import './post-list.css';
import { useEffect, useState } from 'preact/hooks';

interface Post {
  title: string;
  slug: string;
  dateAdded: string;
}

const PostList = () => {
  
  const [posts, setPosts] = useState<Post[] | null>(null); // Initialize with null

  useEffect(() => {
    async function fetchDataAsync() {
      const postsData = await fetchData();
      setPosts(postsData);
    }

    fetchDataAsync();
  }, []);

  if (posts === null) {
    return <div>Loading...</div>;
  }

  return (
    <ul class="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <a href={`/post/${post.slug}`} class="post-title-font">
            {post.dateAdded.slice(0, 10)} | {post.title}
          </a>
        </li>
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
              slug
              dateAdded
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
    console.log(data)
    return data.user.publication.posts;
  }

export default PostList;