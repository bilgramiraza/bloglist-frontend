import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, likeBlog, selectBlogById } from '../../reducers/blogsReducer';
import { notify } from '../../reducers/notificationReducer';

const Blog = () => {
  const id = useParams().id;

  const blog = useSelector(state => selectBlogById(state, id));

  const currentUser = useSelector(state => state.auth.username);

  const dispatch = useDispatch();

  const deleteButtonStyle = {
    display: blog?.user.username === currentUser ? '' : 'none'
  };

  const handleLikeClick = async () => {
    try {
      await dispatch(likeBlog(blog));
      dispatch(notify(`Blog(${blog.title}) Liked Successfully`));
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 5));
    }
  };

  const handleDeleteClick = async () => {
    const deleteConfirm = window.confirm(`Delete ${blog.title} By ${blog.author}?`);
    if (!deleteConfirm) return;
    try {
      await dispatch(deleteBlog(blog._id));
      dispatch(notify(`Blog(${blog.title} By ${blog.author}) Deleted Successfully`));
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 5));
    }
  };

  return (
    <div>
      <h4>{blog?.title}</h4>
      <p>{`-${blog?.author}`}</p>
      <div>
        <p data-testid="blogUrl">{blog?.url}</p>
        <button data-testid="blogLike" onClick={handleLikeClick}>
          {blog?.likes}
        </button>
        <p data-testid="blogUser">Submitted By {blog?.user.username}</p>
        <button data-testid="blogDelete" style={deleteButtonStyle} onClick={handleDeleteClick}>
          delete
        </button>
      </div>
    </div>
  );
};

export default Blog;
