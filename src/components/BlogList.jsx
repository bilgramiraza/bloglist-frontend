import { getAll } from '../services/blogs';
import { Link } from 'react-router-dom';
import { useQueryWithToast } from './Notification';

const BlogList = () => {
  const {
    data: blogs,
    isLoading: blogsLoadingStatus,
    isError: blogsErrorStatus,
  } = useQueryWithToast({
    queryKey: ['blogList'],
    queryFn: getAll,
    queryOptions: {
      select: blogs => blogs.toSorted((blogA, blogB) => blogB.likes - blogA.likes),
    },
    toastMsg: {
      loading: 'Fetching Blogs...',
      success: (data) => `Successfully Fetched Blogs(${data.length})`,
      error: (err) => err.message || 'Error Fetching Blogs'
    },
  });

  if (blogsLoadingStatus) {
    return (
      <div data-testid="bloglist">
        <p>Loading Blogs</p>
      </div>
    );
  }
  if (blogsErrorStatus) {
    return (
      <div data-testid="bloglist">
        <p>Error Getting Blogs</p>
      </div>
    );
  }

  const blogStyle = {
    width: '15%',
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 2
  };

  const blogListStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  };

  return (
    <div data-testid="bloglist">
      {blogs.map((blog) => (
        <div style={blogStyle} key={blog._id}>
          <Link to={`/blogs/${blog._id}`} style={blogListStyle}>
            <h4>{blog.title}</h4>
            <p>{`-${blog.author}`}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
