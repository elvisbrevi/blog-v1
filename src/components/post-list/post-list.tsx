import './post-list.css';
import { useEffect, useState } from 'react';
import { Loading } from '../loading/loading';
import { BlogPost, loadBlogPosts } from '../../services/blog-service';

const PostList = () => {
  
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    async function fetchDataAsync() {
      const postsData = await loadBlogPosts();
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
          <a href={`/post/${post.slug}`}>
            <span className="post-date">{post.date.slice(0, 10)}: </span>
            {post.title}
          </a>
        </li>
      ))} 
    </ul>
  );
};


export default PostList;