import './post.css';
import { Suspense, use } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostBody from '../../components/post-body/post-body';
import OptimizedImage from '../../components/optimized-image/optimized-image';
import { AdjacentPosts, BlogPost, formatDate, getAdjacentPosts, getBlogPost, postNumber } from '../../services/blog-service';
import { usePageMeta } from '../../hooks/use-page-meta';
import NotFoundPage from '../not-found/not-found';

const PostPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  // Suspends until the post is loaded (see the <Suspense> in app.tsx).
  const post = use(getBlogPost(slug));

  return post ? <PostArticle post={post} /> : <NotFoundPage />;
};

const PostArticle = ({ post }: { post: BlogPost }) => {
  usePageMeta(post.title, post.description);
  const date = post.date.substring(0, 10);

  return (
    <article className="post">
      <header className="post-header">
        <Link className="post-back label" to="/blog">← All notes</Link>
        <p className="post-meta">
          <span className="pill">No. {postNumber(post.slug)}</span>
          <time className="label" dateTime={date}>{formatDate(date)}</time>
          <span className="label">{post.readingTime} min read</span>
        </p>
        <h1 className="post-heading">{post.title}</h1>
        {post.description && <p className="post-lede">{post.description}</p>}
        {post.tags.length > 0 && (
          <ul className="post-tags" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag} className="label">#{tag}</li>
            ))}
          </ul>
        )}
      </header>
      {post.cover && (
        <OptimizedImage
          src={post.cover}
          alt=""
          className="post-cover"
          aspectRatio="800 / 457"
          priority={true}
        />
      )}
      <PostBody {...post} />
      <Suspense fallback={null}>
        <PostNavigation adjacent={getAdjacentPosts(post.slug)} />
      </Suspense>
    </article>
  );
};

const PostNavigation = ({ adjacent }: { adjacent: Promise<AdjacentPosts> }) => {
  const { newer, older } = use(adjacent);
  if (!newer && !older) return null;

  return (
    <nav className="post-navigation" aria-label="More posts">
      {older && (
        <Link className="nav-card prev" to={`/post/${older.slug}`} rel="prev">
          <span className="label">← Older · No. {postNumber(older.slug)}</span>
          <span className="nav-card-title">{older.title}</span>
        </Link>
      )}
      {newer && (
        <Link className="nav-card next" to={`/post/${newer.slug}`} rel="next">
          <span className="label">Newer · No. {postNumber(newer.slug)} →</span>
          <span className="nav-card-title">{newer.title}</span>
        </Link>
      )}
    </nav>
  );
};


export default PostPage;
