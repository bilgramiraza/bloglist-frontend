import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewBlog, resetCreateStatus } from '../reducers/blogsReducer';
import { notify } from '../reducers/notificationReducer';
import PropTypes from 'prop-types';
import { STATUS } from '../utils/constants';

const BlogForm = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const {
    status: { create: status },
    error
  } = useSelector(state => state.blogs);
  const dispatch = useDispatch();

  const handleAuthorChange = (e) => setAuthor(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleUrlChange = (e) => setUrl(e.target.value);

  useEffect(() => {
    if (status === STATUS.SUCCEEDED && title) {
      dispatch(notify(`Blog(${title}) Created Successfully`));
      setTitle('');
      setAuthor('');
      setUrl('');
      dispatch(resetCreateStatus());
      onClose();
    }
    if (status === STATUS.FAILED) {
      dispatch(notify(error || 'An Error Occured', false, 5));
      dispatch(resetCreateStatus());
    }
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    /* c8 ignore next */ //Protection vs Weirdos
    if (!title || !author || !url) return;
    dispatch(createNewBlog({ title, author, url }));
  };

  return (
    <div>
      <h2>New Blog</h2>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={status === STATUS.LOADING}>
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
        </fieldset>
      </form>
    </div>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};
