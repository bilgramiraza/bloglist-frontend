const BlogList = ({ blogs }) => {
  return (
    <div>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  );
};

const Blog = ({ blog }) => {

  return (
    <div>
      <h3>{blog.title}</h3>
      <span>{`-${blog.author}`}</span>
    </div>
  );
};

export default BlogList;
