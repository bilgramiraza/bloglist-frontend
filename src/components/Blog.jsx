const Blog = ({ blog }) => {

  return (
    <div>
      <h3>{blog.title}</h3>
      <span>{`-${blog.author}`}</span>
    </div>
  );
};

export default Blog;
