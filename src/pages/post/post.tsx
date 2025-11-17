import './post.css';
import { useEffect, useState } from 'react';
import PostBody from '../../components/post-body/post-body';
import { Loading } from '../../components/loading/loading';
import { useParams } from 'react-router-dom';
import { BlogPost, getBlogPost } from '../../services/blog-service';
import OptimizedImage from '../../components/optimized-image/optimized-image';

const PostPage = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const { slug } = useParams<{ slug: string }>();
  
  useEffect(() => {
    async function fetchDataAsync() {
      if (slug) {
        const postData = await getBlogPost(slug);
        setPost(postData);
      }
    }
    
    fetchDataAsync();
  }, [slug]);

  if (!post) {
    // loading icon
    return <Loading />;
  }

  return (
    <div>
      <div className="row">
        <div />
        <div>
          <div className="post-content">
              <span className="post-date">{post.date.substring(0, 10)}</span>
              <h1 className="title">{post.title}</h1>
              {post.cover && (
                <OptimizedImage
                  src={post.cover}
                  alt={post.title}
                  className="post-featured-image"
                  aspectRatio="16/9"
                  priority={true}
                />
              )}
              <PostBody {...post} />
          </div>
        </div>
        <div />
      </div>
    </div>
  );
};


export default PostPage;