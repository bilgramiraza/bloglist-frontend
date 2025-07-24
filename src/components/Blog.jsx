import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateNewCommentMutation, useGetAllBlogsQuery, useLikeBlogMutation, useRemoveBlogMutation } from '../services/blogs';
import { notifyError, notifySuccess } from './Notification';

const Blog = () => {
  const id = useParams().id;

  const navigate = useNavigate();

  const [prevError, setPrevError] = useState(null);

  const currentUser = useSelector(state => state.auth.username);

  const [comment, setComment] = useState('');

  const handleCommentChange = (e) => setComment(e.target.value);

  const [
    createNewComment,
    {
      isLoading: commentLoadingStatus,
      isError: commentErrorStatus
    }
  ] = useCreateNewCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* c8 ignore next */ //Protection vs Weirdos
    if (!comment) return;
    try {
      await createNewComment({ blogId: id, comment }).unwrap();
      setComment('');
      notifySuccess(`Successfully Commented Under Blog(${blog.title})`);
    } catch (err) {
      notifyError(err || 'An Error Occured');
    }
  };

  const {
    data: blogs,
    error: blogsError,
    isLoading: blogsLoadingStatus,
    isError: blogsErrorStatus
  } = useGetAllBlogsQuery();

  const blog = blogs?.find(blog => blog._id === id);

  const [
    likeBlog,
    {
      isLoading: likeLoadingStatus,
      isError: likeErrorStatus
    }
  ] = useLikeBlogMutation();

  const [
    removeBlog,
    {
      isLoading: removeLoadingStatus,
      isError: removeErrorStatus
    }
  ] = useRemoveBlogMutation();

  useEffect(() => {
    if (blogsErrorStatus && blogsError !== prevError) {
      notifyError(err || 'An Error Occured');
      setPrevError(blogsError);
    }
  }, [blogsErrorStatus, blogsError, prevError]);

  const deleteButtonStyle = {
    display: blog?.user.username === currentUser ? '' : 'none'
  };

  const handleLikeClick = async () => {
    try {
      await likeBlog(blog).unwrap();
      notifySuccess(`Blog(${blog.title}) Liked Successfully`);
    } catch (err) {
      notifyError(err || 'An Error Occured');
    }
  };

  const handleDeleteClick = async () => {
    const deleteConfirm = window.confirm(`Delete ${blog.title} By ${blog.author}?`);
    if (!deleteConfirm) return;
    try {
      await removeBlog(blog._id).unwrap();
      notifySuccess(`Blog(${blog.title} By ${blog.author}) Deleted Successfully`);
      navigate('/');
    } catch (err) {
      notifyError(err || 'An Error Occured');
    }
  };

  if (blogsLoadingStatus) {
    return (
      <div>
        <h4>Loading Title</h4>
        <p>Loading Author</p>
        <div>
          <p>Loading Url</p>
          <button>
            Loading
          </button>
          <p>Loading User</p>
          <button>
            Loading
          </button>
        </div>
      </div>
    );
  }

  if (blogsErrorStatus) {
    return (
      <div>
        <h4>Error Loading Blog</h4>
        <div>
          <p>Error Loading Blog</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4>{blog?.title}</h4>
      <p>{`-${blog?.author}`}</p>
      <div>
        <p data-testid="blogUrl">{blog?.url}</p>
        <button data-testid="blogLike" onClick={handleLikeClick} disabled={likeLoadingStatus && !likeErrorStatus}>
          {blog?.likes}
        </button>
        <p data-testid="blogUser">Submitted By {blog?.user.username}</p>
        <button data-testid="blogDelete" style={deleteButtonStyle} onClick={handleDeleteClick} disabled={removeLoadingStatus && !removeErrorStatus}>
          delete
        </button>
      </div>
      <div>
        <h5>Comments</h5>
        <div>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={commentLoadingStatus && !commentErrorStatus}>
              <input
                type="text"
                name="comment"
                value={comment}
                onChange={handleCommentChange}
              />
              <button type="submit" disabled={false}>
                Post Comment
              </button>
            </fieldset>
          </form>
        </div>
        <ul>
          {!blog?.comments.length
            ? <p>No Comments to Display</p>
            : blog?.comments.map(comment => <li key={comment}>{comment}</li>)
          }
        </ul>
      </div>
    </div>
  );
};

export default Blog;
