import './blog.css';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import PostList from "../../components/post-list/post-list";
import { Loading } from '../../components/loading/loading';
import { usePageMeta } from '../../hooks/use-page-meta';

const BlogPage = () => {
  usePageMeta();

  return (
    <div className="blog">
      <section className="home-intro">
        <h1>Hi, I'm Elvis.</h1>
        <p>
          I'm a full-stack developer, and this blog is my second brain: notes on the
          technologies and ideas I explore, from Rust and WebAssembly to the cloud and
          Advent of Code. More <Link to="/about">about me</Link>, or see what I'm building
          in my <Link to="/side-projects">side projects</Link>.
        </p>
      </section>
      <Suspense fallback={<Loading />}>
        <PostList />
      </Suspense>
    </div>
  );
};

export default BlogPage;
