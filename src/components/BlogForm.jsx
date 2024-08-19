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
          <input type="text" name="title" value={title} onChange={handleTitleChange} />
        </label>
        <label>
          Author:
          <input type="text" name="author" value={author} onChange={handleAuthorChange} />
        </label>
        <label>
          Url:
          <input type="text" name="url" value={url} onChange={handleUrlChange} />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  handleCreation: PropTypes.func.isRequired,
};
