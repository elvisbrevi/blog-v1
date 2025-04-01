import './post-list.css';
import { useEffect, useState } from 'react';
import { Loading } from '../loading/loading';

interface Post {
  title: string;
  slug: string;
  publishedAt: string;
}

interface PostWrapper {
  node: Post;
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
    return <Loading />;
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <a className="h5" href={`/post/${post.slug}`}>
            <small className="text-muted">{post.publishedAt.slice(0, 10)}: </small>
            {post.title}
          </a>
        </li>
      ))} 
    </ul>
  );
};

async function fetchData(): Promise<Post[]> {
    const query = `
      query Publication {
        publication(host: "elvisbrevi.hashnode.dev") {
          posts(first: 20) {
            edges {
              node {
                title
                slug
                publishedAt
              }
            }
          }
        }
      }
    `;
  
    const response = await fetch("https://gql.hashnode.com", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();

    const postsData: Post[] = data.publication.posts.edges.map((item: PostWrapper) => ({
      title: item.node.title,
      slug: item.node.slug,
      publishedAt: item.node.publishedAt
    }));

    return postsData;
  }

export default PostList;