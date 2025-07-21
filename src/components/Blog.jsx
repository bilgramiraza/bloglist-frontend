import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { commentOnBlog, deleteBlog, likeBlog, resetCommentStatus, resetDeleteStatus, resetLikeStatus, selectBlogById } from '../reducers/blogsReducer';
import { notify } from '../reducers/notificationReducer';
import { useEffect, useState } from 'react';
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

  const currentUser = useSelector(state => state?.auth?.credentials?.username || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [comment, setComment] = useState('');

  const handleComment = (e) => setComment(e.target.value);

  useEffect(() => {
    if (commentStatus === STATUS.SUCCEEDED && blog?.title) {
      dispatch(notify(`Successfully Commented on Blog(${blog.title})`));
      setComment('');
      dispatch(resetCommentStatus());
    }
    if (commentStatus === STATUS.FAILED) {
      dispatch(notify(error || 'An Error Occured', false, 5));
      dispatch(resetCommentStatus());
    }
  }, [commentStatus]);

  useEffect(() => {
    if (likeStatus === STATUS.SUCCEEDED && blog?.title) {
      dispatch(notify(`Blog(${blog.title}) Liked Successfully`));
      dispatch(resetLikeStatus());
    }
    if (likeStatus === STATUS.FAILED) {
      dispatch(notify(error || 'An Error Occured', false, 5));
      dispatch(resetLikeStatus());
    }
  }, [likeStatus]);

  useEffect(() => {
    if (deleteStatus === STATUS.SUCCEEDED && blog?.title && blog?.author) {
      dispatch(notify(`Blog(${blog.title} By ${blog.author}) Deleted Successfully`));
      dispatch(resetDeleteStatus());
      setTimeout(() => navigate('/'), 500);
    }
    if (deleteStatus === STATUS.FAILED) {
      dispatch(notify(error || 'An Error Occured', false, 5));
      dispatch(resetDeleteStatus());
    }
  }, [deleteStatus]);

  const deleteButtonStyle = {
    display: blog?.user.username === currentUser ? '' : 'none'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* c8 ignore next */ //Protection vs Weirdos
    if (!comment) return;
    dispatch(commentOnBlog({ blogId: blog._id, comment }));
  };

  const handleLikeClick = () => {
    dispatch(likeBlog(blog));
  };

  const handleDeleteClick = () => {
    const deleteConfirm = window.confirm(`Delete ${blog.title} By ${blog.author}?`);
    if (!deleteConfirm) return;
    dispatch(deleteBlog(blog._id));
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
