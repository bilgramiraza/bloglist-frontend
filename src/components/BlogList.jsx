import { useSelector } from 'react-redux';
import { selectSortedBlogs } from '../../reducers/blogsReducer';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const blogs = useSelector(selectSortedBlogs);

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
