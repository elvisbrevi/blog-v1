import './post.css';
import { Suspense, use } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostBody from '../../components/post-body/post-body';
import OptimizedImage from '../../components/optimized-image/optimized-image';
import { AdjacentPosts, BlogPost, getAdjacentPosts, getBlogPost } from '../../services/blog-service';
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
    <article className="post-content">
      <header className="post-header">
        <p className="post-meta">
          <time dateTime={date}>{date}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime} min read</span>
        </p>
        <h1 className="post-heading">{post.title}</h1>
      </header>
      {post.cover && (
        <OptimizedImage
          src={post.cover}
          alt=""
          className="post-featured-image"
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
        <Link className="nav-button prev" to={`/post/${older.slug}`} rel="prev">
          <span className="nav-label">← Older</span>
          <span className="nav-title">{older.title}</span>
        </Link>
      )}
      {newer && (
        <Link className="nav-button next" to={`/post/${newer.slug}`} rel="next">
          <span className="nav-label">Newer →</span>
          <span className="nav-title">{newer.title}</span>
        </Link>
      )}
    </nav>
  );
};


export default PostPage;
