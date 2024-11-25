import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from '../services/blogs';
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';

const BlogForm = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: newBlog => {
      const blogs = queryClient.getQueryData(['blogList']);
      queryClient.setQueryData(['blogList'], blogs.concat(newBlog));
      notify(dispatch, `Blog(${newBlog.title}) Created Successfully`);
    },
    onError: err => notify(dispatch, err.response.data.error, false, 5),
  });

  const handleAuthorChange = (e) => setAuthor(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleUrlChange = (e) => setUrl(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    /* c8 ignore next */ //Protection vs Weirdos
    if (!title || !author || !url) return;
    newBlogMutation.mutate({ title, author, url });
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
