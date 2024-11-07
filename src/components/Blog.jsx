import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { deleteBlog, likeBlog } from '../../reducers/blogsReducer';
import { notify } from '../../reducers/notificationReducer';

const Blog = ({ blog, currentUser }) => {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const toggle = () => setVisible(!visible);

  const blogStyle = {
    width: '15%',
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 2
  };

  const blogHeaderStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  };
  const blogBodyStyle = {
    display: visible ? '' : 'none'
  };
  const deleteButtonStyle = {
    display: blog.user.username === currentUser.username ? '' : 'none'
  };

  const handleLikeClick = async () => {
    try {
      await dispatch(likeBlog(blog));
      dispatch(notify(`Blog(${blog.title}) Liked Successfully`));
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false));
    }
  };

  const handleDeleteClick = async () => {
    const deleteConfirm = window.confirm(`Delete ${blog.title} By ${blog.author}?`);
    if (!deleteConfirm) return;
    try {
      await dispatch(deleteBlog(blog._id));
      dispatch(notify(`Blog(${blog.title} By ${blog.author}) Deleted Successfully`));
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false));
    }
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
        <button data-testid="blogLike" onClick={handleLikeClick}>
          {blog.likes}
        </button>
        <p data-testid="blogUser">{blog.user.username}</p>
        <button data-testid="blogDelete" style={deleteButtonStyle} onClick={handleDeleteClick}>
          delete
        </button>
      </div>
    </div>
  );
};

export default Blog;

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
};
