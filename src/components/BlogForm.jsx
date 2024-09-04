import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ handleCreation }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleAuthorChange = (e) => setAuthor(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleUrlChange = (e) => setUrl(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    /* c8 ignore next */ //Protection vs Weirdos
    if (!title || !author || !url) return;
    handleCreation({ title, author, url });
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
          <input data-testid="title" type="text" name="title" value={title} onChange={handleTitleChange} />
        </label>
        <label>
          Author:
          <input data-testid="author" type="text" name="author" value={author} onChange={handleAuthorChange} />
        </label>
        <label>
          Url:
          <input data-testid="url" type="text" name="url" value={url} onChange={handleUrlChange} />
        </label>
        <button data-testid="create" type="submit" disabled={!title || !author || !url}>Create</button>
      </form>
    </div>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  handleCreation: PropTypes.func.isRequired,
};
