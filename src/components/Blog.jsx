import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { commentOnBlog, deleteBlog, likeBlog, selectBlogById } from '../reducers/blogsReducer';
import { notify } from '../reducers/notificationReducer';
import { useState } from 'react';
import { STATUS } from '../utils/constants';

const Blog = () => {
  const id = useParams().id;

  const {
    status: {
      delete: deleteStatus,
      like: likeStatus,
      comment: commentStatus
    },
    error,
    blog
  } = useSelector(state => selectBlogById(state, id));

  const currentUser = useSelector(state => state.auth.username);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [comment, setComment] = useState('');

  const handleComment = (e) => setComment(e.target.value);

  const deleteButtonStyle = {
    display: blog?.user.username === currentUser ? '' : 'none'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* c8 ignore next */ //Protection vs Weirdos
    if (!comment) return;

    try {
      await dispatch(commentOnBlog({ blogId: blog._id, comment })).unwrap();
      dispatch(notify(`Successfully Commented on Blog(${blog.title})`));
      setComment('');
    } catch (err) {
      dispatch(notify(err.message || err || 'An Error Occured', false, 5));
    }
  };

  const handleLikeClick = async () => {
    try {
      await dispatch(likeBlog(blog)).unwrap();
      dispatch(notify(`Blog(${blog.title}) Liked Successfully`));
    } catch (err) {
      dispatch(notify(error || err || 'An Error Occured', false, 5));
    }
  };

  const handleDeleteClick = async () => {
    const deleteConfirm = window.confirm(`Delete ${blog.title} By ${blog.author}?`);
    if (!deleteConfirm) return;
    try {
      await dispatch(deleteBlog(blog._id)).unwrap();
      dispatch(notify(`Blog(${blog.title} By ${blog.author}) Deleted Successfully`));
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      dispatch(notify(error || err || 'An Error Occured', false, 5));
    }
  };

  return (
    <div>
      <h4>{blog?.title}</h4>
      <p>{`-${blog?.author}`}</p>
      <div>
        <p data-testid="blogUrl">{blog?.url}</p>
        <button
          data-testid="blogLike"
          onClick={handleLikeClick}
          disabled={likeStatus === STATUS.LOADING}
        >
          {blog?.likes}
        </button>
        <p data-testid="blogUser">Submitted By {blog?.user.username}</p>
        <button
          data-testid="blogDelete"
          style={deleteButtonStyle}
          onClick={handleDeleteClick}
          disabled={deleteStatus === STATUS.LOADING}
        >
          {deleteStatus === STATUS.LOADING ? 'deleting' : 'delete'}
        </button>
      </div>
      <div>
        <h5>Comments</h5>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={commentStatus === STATUS.LOADING}>
            <input
              type='text'
              name='comment'
              value={comment}
              onChange={handleComment}
            />
            <button type='submit'>
              Post Comment
            </button>
          </fieldset>
        </form>
        <ul>
          {
            !blog?.comments.length
              ? <p> No Comments to Display</p>
              : blog?.comments.map(comment => <li key={comment}>{comment}</li>)
          }
        </ul>
      </div>
    </div>
  );
};

export default Blog;
