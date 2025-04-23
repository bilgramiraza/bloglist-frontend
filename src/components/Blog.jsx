import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { notify } from '../../reducers/notificationReducer';
import { useGetAllBlogsQuery, useLikeBlogMutation, useRemoveBlogMutation } from '../services/blogs';

const Blog = () => {
  const id = useParams().id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [prevError, setPrevError] = useState(null);

  const currentUser = useSelector(state => state.auth.username);

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
      dispatch(notify(blogsError || 'An Error Occured', false, 3));
      setPrevError(blogsError);
    }
  }, [dispatch, blogsErrorStatus, blogsError, prevError]);

  const deleteButtonStyle = {
    display: blog?.user.username === currentUser ? '' : 'none'
  };

  const handleLikeClick = async () => {
    try {
      await likeBlog(blog).unwrap();
      dispatch(notify(`Blog(${blog.title}) Liked Successfully`));
    } catch (err) {
      dispatch(notify(err || 'An Error Occured', false, 5));
    }
  };

  const handleDeleteClick = async () => {
    const deleteConfirm = window.confirm(`Delete ${blog.title} By ${blog.author}?`);
    if (!deleteConfirm) return;
    try {
      await removeBlog(blog._id).unwrap();
      dispatch(notify(`Blog(${blog.title} By ${blog.author}) Deleted Successfully`));
      navigate('/');
    } catch (err) {
      dispatch(notify(err || 'An Error Occured', false, 5));
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
    </div>
  );
};

export default Blog;
