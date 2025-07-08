import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, selectSortedBlogs } from '../reducers/blogsReducer';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { notify } from '../reducers/notificationReducer';
import { STATUS } from '../utils/constants';

const BlogList = () => {
  const {
    status: { fetch: status },
    blogs,
    error
  } = useSelector(selectSortedBlogs);

  const dispatch = useDispatch();

  const blogStyle = {
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 2
  };

  const blogHeaderStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 2
  };

  useEffect(() => {
    if (status === STATUS.INITIAL) dispatch(fetchBlogs());
    if (status === STATUS.FAILED) dispatch(notify(error || 'An Error Occured', false, 3));
  }, [status, dispatch]);

  if (status === STATUS.LOADING) {
    return (
      <div data-testid="bloglist" style={blogStyle}>
        <p>Loading Blogs...</p>
      </div>
    );
  }

  if (status === STATUS.FAILED) {
    return (
      <div data-testid="bloglist" style={blogStyle}>
        <p>Failed to Load Blogs</p>
      </div>
    );
  }

  if (!blogs || !blogs.length) {
    return (
      <div data-testid="bloglist" style={blogStyle}>
        <p>No Blogs to Display</p>
      </div>
    );
  }

  return (
    <div data-testid="bloglist" style={blogStyle}>
      {blogs.map((blog) => (
        <div style={blogHeaderStyle} key={blog._id}>
          <h4>
            <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
          </h4>
          <p>{`-${blog.author}`}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
