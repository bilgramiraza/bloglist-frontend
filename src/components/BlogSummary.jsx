import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';
import { remove, sendLike } from '../services/blogs';
import { useAuthValue } from '../reducers/authReducer';

const BlogSummary = () => {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible(!visible);

  const { username, token } = useAuthValue();

  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const likeBlogMutation = useMutation({
    mutationFn: sendLike,
    onSuccess: likedBlog => {
      const blogs = queryClient.getQueryData(['blogList']);
      queryClient.setQueryData(
        ['blogList'],
        blogs.map(blog => blog._id === likedBlog._id ? likedBlog : blog)
      );
      notify(dispatch, `Blog(${likedBlog.title}) Liked Successfully`);
    },
    onError: err => {
      notify(dispatch, err.message || 'An Error Occured', false, 5);
    },
    retry: false,
  });

  const deleteBlogMutation = useMutation({
    mutationFn: remove,
    onSuccess: deletedBlog => {
      const blogs = queryClient.getQueryData(['blogList']);
      queryClient.setQueryData(
        ['blogList'],
        blogs.filter((blog) => blog._id !== deletedBlog._id)
      );
      notify(dispatch, `Blog(${deletedBlog.title} By ${deletedBlog.author}) Deleted Successfully`);
    },
    onError: err => {
      notify(dispatch, err.message || 'An Error Occured', false, 5);
    },
    retry: false,
  });

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
    display: blog.user.username === username ? '' : 'none'
  };

  const handleLikeClick = () => {
    likeBlogMutation.mutate({ token, blog });
  };

  const handleDeleteClick = () => {
    const deleteConfirm = window.confirm(`Delete ${blog.title} By ${blog.author}?`);
    if (!deleteConfirm) return;

    deleteBlogMutation.mutate({ token, blog });
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

export default BlogSummary;
