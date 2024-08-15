import { useState } from "react";

const BlogList = ({ blogs }) => {
  return (
    <div>
      {
        blogs.map(blog => <Blog key={blog._id} blog={blog} />)
      }
    </div>
  );
};

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible(!visible);

  const blogStyle = {
    width: '15%',
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 2,
  };

  const blogHeaderStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };
  const blogBodyStyle = {
    display: visible ? '' : 'none',
  };

  return (
    <div style={blogStyle}>
      <div style={blogHeaderStyle}>
        <h4>{blog.title}</h4>
        <p>{`-${blog.author}`}</p>
        <button onClick={toggle}>{visible ? 'hide' : 'show'}</button>
      </div>
      <div style={blogBodyStyle}>
        <p>{blog.url}</p>
        <p>{blog.likes}</p>
        <p>{blog.user.username}</p>
      </div>
    </div>
  );
};

export default BlogList;
