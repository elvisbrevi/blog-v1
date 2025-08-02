import './post.css';
import { useEffect, useState } from 'react';
import PostBody from '../../components/post-body/post-body';
import { Loading } from '../../components/loading/loading';
import { useParams } from 'react-router-dom';
import { BlogPost, getBlogPost } from '../../services/blog-service';

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
              <img className="post-featured-image" width={500} src={post.cover} />
              <PostBody {...post} />
          </div>
        </div>
        <div />
      </div>
    </div>
  );
};


export default PostPage;