import { useSelector } from 'react-redux';
import { selectSortedBlogs } from '../reducers/blogsReducer';
import { Link } from 'react-router-dom';
import { STATUS } from '../utils/constants';

const BlogList = () => {
  const {
    status: { fetch: status },
    blogs,
    error
  } = useSelector(selectSortedBlogs);

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
        <p>{`Failed to Load Blogs ${error}`}</p>
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
