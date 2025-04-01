import PostList from "../../components/post-list/post-list";

const BlogPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col" />
        <div className="col-lg-8 col-sm-12">
          <PostList />
        </div>
        <div className="col" />
      </div>
    </div>
  );
};

export default BlogPage;
