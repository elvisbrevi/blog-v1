import './post-list.css';
import { useEffect, useState } from 'react';
import { Loading } from '../loading/loading';
import { BlogPost, loadBlogPosts } from '../../services/blog-service';
import OptimizedImage from '../optimized-image/optimized-image';

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
      {posts.map((post, index) => (
        <li key={post.slug}>
          <a href={`/post/${post.slug}`} className="post-link">
            {post.cover && (
              <div className="post-thumbnail">
                <OptimizedImage
                  src={post.cover}
                  alt={post.title}
                  aspectRatio="16/9"
                  priority={index === 0}
                />
              </div>
            )}
            <div className="post-info">
              <span className="post-date">{post.date.slice(0, 10)}</span>
              <h2 className="post-title">{post.title}</h2>
              {post.description && (
                <p className="post-excerpt">{post.description}</p>
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};


export default PostList;