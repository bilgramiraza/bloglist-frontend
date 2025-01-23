import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from '../services/blogs';
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';
import PropTypes from 'prop-types';
import { useAuthValue } from '../reducers/authReducer';

const BlogForm = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const { token } = useAuthValue();

  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: newBlog => {
      const blogs = queryClient.getQueryData(['blogList']);
      queryClient.setQueryData(['blogList'], blogs.concat(newBlog));
      notify(dispatch, `Blog(${newBlog.title}) Created Successfully`);
      onClose();
    },
    onError: err => {
      notify(dispatch, err.message || 'An Error Occured', false, 5);
    },
    retry: false,
  });

  const handleAuthorChange = (e) => setAuthor(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleUrlChange = (e) => setUrl(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    /* c8 ignore next */ //Protection vs Weirdos
    if (!title || !author || !url) return;
    const newBlog = { title, author, url };
    newBlogMutation.mutate({ token, newBlog });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>New Blog</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            data-testid="title"
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
          />
        </label>
        <label>
          Author:
          <input
            data-testid="author"
            type="text"
            name="author"
            value={author}
            onChange={handleAuthorChange}
          />
        </label>
        <label>
          Url:
          <input data-testid="url" type="text" name="url" value={url} onChange={handleUrlChange} />
        </label>
        <button data-testid="create" type="submit" disabled={!title || !author || !url}>
          Create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};
