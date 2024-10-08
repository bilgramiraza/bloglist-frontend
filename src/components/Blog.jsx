import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, handleLikes, handleDelete, currentUser }) => {
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
  const deleteButtonStyle = {
    display: blog.user.username === currentUser.username ? '' : 'none',
  };

  const handleLikeClick = () => {
    handleLikes(blog);
  };

  const handleDeleteClick = () => {
    handleDelete(blog._id);
  };

  return (
    <div style={blogStyle}>
      <div style={blogHeaderStyle}>
        <h4>{blog.title}</h4>
        <p>{`-${blog.author}`}</p>
        <button onClick={toggle}>{visible ? 'hide' : 'show'}</button>
      </div>
      <div style={blogBodyStyle}>
        <p data-testid="blogUrl">{blog.url}</p>
        <button data-testid="blogLike" onClick={handleLikeClick}>{blog.likes}</button>
        <p data-testid="blogUser">{blog.user.username}</p>
        <button data-testid="blogDelete" style={deleteButtonStyle} onClick={handleDeleteClick}>delete</button>
      </div>
    </div>
  );
};

export default Blog;

Blog.protTypes = {
  blog: PropTypes.object.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};
