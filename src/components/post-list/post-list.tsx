import './post-list.css';
import { use } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, loadBlogPosts, postNumber } from '../../services/blog-service';
import PostThumbnail from './post-thumbnail';

const PostList = () => {
  // Suspends until the posts are loaded (see the <Suspense> in blog.tsx).
  const posts = use(loadBlogPosts());

  return (
    <ul className="post-list">
      {posts.map((post, index) => {
        // The newest post gets a wide card.
        const featured = index === 0;
        return (
          <li key={post.slug} className={featured ? 'post-card featured' : 'post-card'}>
            <Link to={`/post/${post.slug}`} className="post-card-link">
              {post.cover && <PostThumbnail cover={post.cover} eager={index < 4} featured={featured} />}
              <div className="post-card-body">
                <p className="post-card-meta">
                  <span className="pill">No. {postNumber(post.slug)}</span>
                  <time className="label" dateTime={post.date.slice(0, 10)}>{formatDate(post.date)}</time>
                </p>
                <h3 className="post-card-title">{post.title}</h3>
                {post.description && (
                  <p className="post-card-excerpt">{post.description}</p>
                )}
                {featured && <span className="post-card-more label" aria-hidden="true">Read the note →</span>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};


export default PostList;
