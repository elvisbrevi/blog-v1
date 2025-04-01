import './post.css';
import { useEffect, useState } from 'react';
import PostBody from '../../components/post-body/post-body';
import { Loading } from '../../components/loading/loading';
import { useParams } from 'react-router-dom';
import type { PostData } from '../../interfaces/PostData';

const PostPage = () => {
  const [post, setPost] = useState<PostData | null>(null);
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch post data from Hashnode API
  useEffect(() => {
    async function fetchDataAsync() {
      if (slug) {
        const postData = await fetchData(slug);
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
    <div className="container-fluid">
      <div className="row">
        <div className="col" />
        <div className="col-lg-8 col-sm-12">
          <div className="post-content">
              <span className="post-date">{post.publishedAt.substring(0, 10)}</span>
              <h1 className="title">{post.title}</h1>
              <img className="post-featured-image" width={500} src={post.coverImage.url} />
              <PostBody {...post} />
          </div>
        </div>
        <div className="col" />
      </div>
    </div>
  );
};

async function fetchData(slug: string): Promise<PostData> {
  // Get post data from Hashnode API
  const query = `
  query Publication {
    publication(host: "elvisbrevi.hashnode.dev") {
      post(slug: "${slug}") {
        title
        slug
        publishedAt
        coverImage {
          url
        }
        content {
          html
        }
      }
    }
  }
  `;

  const response = await fetch("https://gql.hashnode.com", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const { data } = await response.json();
  return data.publication.post;
}

export default PostPage;