import './post.css';
import { useEffect, useState } from 'preact/hooks';
import PostBody from '../../components/post-body/post-body';
import { Loading } from '../../components/loading/loading';

const PostPage = () => {
  const [post, setPost] = useState<PostData | null>(null);
  
  // Fetch post data from Hashnode API
  useEffect(() => {
    async function fetchDataAsync() {
      const postData = await fetchData();
      setPost(postData);
    }
    
    fetchDataAsync();
  }, []);

  if (!post) {
    // loading icon
    return <Loading />;
  }

  return (
    <div class="container-fluid">
      <div class="row">
        <div class="col" />
        <div class="col-lg-8 col-sm-12">
          <div class="post-content">
              <span class="post-date">{post.publishedAt.substring(0, 10)}</span>
              <h1 class="title">{post.title}</h1>
              <img class="post-featured-image" width={500} src={post.coverImage.url} />
              <PostBody {...post} />
          </div>
        </div>
        <div class="col" />
      </div>
    </div>
  );
};

async function fetchData(): Promise<PostData> {
  
  // Get post slug from URL
  let slug : string | null = window.location.pathname.split("/").slice(-1)[0] || null;

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