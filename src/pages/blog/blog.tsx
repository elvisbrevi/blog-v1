import './blog.css';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { POST_FILES } from 'virtual:post-files';
import PostList from "../../components/post-list/post-list";
import { Loading } from '../../components/loading/loading';
import { usePageMeta } from '../../hooks/use-page-meta';

const TOPICS = ['Notes', 'Rust', 'C#', 'Cloud', 'AI'];

const BlogPage = () => {
  usePageMeta();

  return (
    <div className="blog">
      <section className="home-hero container">
        <div className="home-hero-text">
          <p className="home-topics label">
            {TOPICS.map((topic) => (
              <span key={topic}>{topic}</span>
            ))}
          </p>
          <h1 className="home-title">
            Hi, I'm <span className="home-title-name">Elvis.</span>
          </h1>
          <p className="home-lede">
            I'm a full-stack developer, and this blog is my second brain: notes on the
            technologies and ideas I explore, from Rust and WebAssembly to the cloud and
            Advent of Code. More <Link to="/about">about me</Link>, or see what I'm building
            in my <Link to="/side-projects">side projects</Link>.
          </p>
        </div>
        <figure className="home-art">
          <img
            src="/images/art/hero-480.webp"
            srcSet="/images/art/hero-480.webp 480w, /images/art/hero-960.webp 960w"
            sizes="(max-width: 860px) 70vw, 420px"
            width={480}
            height={600}
            alt="Elvis typing on a laptop at a low wooden desk, next to a bowl of ramen, under a salmon sun."
            fetchPriority="high"
            decoding="async"
          />
          {/* "Elvis's blog" */}
          <span className="home-art-jp jp-vertical" lang="ja" aria-hidden="true">エルビスのブログ</span>
        </figure>
      </section>
      <section className="home-posts container" aria-labelledby="posts-heading">
        <header className="section-head">
          <h2 id="posts-heading" className="section-title">
            All notes <span className="pill">{POST_FILES.length}</span>
          </h2>
          <span className="section-jp" lang="ja" aria-hidden="true">ノート</span>
        </header>
        <Suspense fallback={<Loading />}>
          <PostList />
        </Suspense>
      </section>
    </div>
  );
};

export default BlogPage;
