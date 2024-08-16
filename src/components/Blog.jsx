import { useState } from "react";

const BlogList = ({ blogs, handleLikes }) => {
  if (!blogs.length) return null;

  return (
    <div>
      {
        blogs.map(blog => <Blog key={blog._id} blog={blog} handleLikes={handleLikes} />)
      }
    </div>
  );
};

const Blog = ({ blog, handleLikes }) => {
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

  const handleClick = () => {
    handleLikes(blog);
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
        <button onClick={handleClick}>{blog.likes}</button>
        <p>{blog.user.username}</p>
      </div>
    </div>
  );
};

export default BlogList;
