import './post-list.css';
import { use } from 'react';
import { Link } from 'react-router-dom';
import { loadBlogPosts } from '../../services/blog-service';
import PostThumbnail from './post-thumbnail';

const PostList = () => {
  // Suspends until the posts are loaded (see the <Suspense> in blog.tsx).
  const posts = use(loadBlogPosts());

  return (
    <ul className="post-list">
      {posts.map((post, index) => (
        <li key={post.slug}>
          <Link to={`/post/${post.slug}`} className={post.cover ? 'post-link' : 'post-link no-cover'}>
            <div className="post-info">
              <time className="post-date" dateTime={post.date.slice(0, 10)}>
                {post.date.slice(0, 10)}
              </time>
              <h2 className="post-title">{post.title}</h2>
            </div>
            {post.description && (
              <p className="post-excerpt">{post.description}</p>
            )}
            {post.cover && <PostThumbnail cover={post.cover} eager={index < 3} />}
          </Link>
        </li>
      ))}
    </ul>
  );
};


export default PostList;
