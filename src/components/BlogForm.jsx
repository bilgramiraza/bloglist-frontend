import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { newBlog } from '../../reducers/blogsReducer';
import { notify } from '../../reducers/notificationReducer';
import PropTypes from 'prop-types';

const BlogForm = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const dispatch = useDispatch();

  const handleAuthorChange = (e) => setAuthor(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleUrlChange = (e) => setUrl(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* c8 ignore next */ //Protection vs Weirdos
    if (!title || !author || !url) return;
    try {
      await dispatch(newBlog({ title, author, url }));
      setTitle('');
      setAuthor('');
      setUrl('');
      dispatch(notify(`Blog(${title}) Created Successfully`));
      onClose();
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false));
    }
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
