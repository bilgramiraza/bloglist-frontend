import { getAll } from '../services/blogs';
import { useQuery } from '@tanstack/react-query';
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const dispatch = useNotificationDispatch();
  const [prevError, setPrevError] = useState(null);

  const blogsQuery = useQuery({
    queryKey: ['blogList'],
    queryFn: getAll,
    retry: false,
    select: blogs => blogs.toSorted((blogA, blogB) => blogB.likes - blogA.likes),
    throwOnError: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (blogsQuery.isError && blogsQuery.error?.message !== prevError) {
      notify(dispatch, blogsQuery.error.message || 'An Error Occured', false, 5);
      setPrevError(blogsQuery.error.message);
    }
  }, [dispatch, blogsQuery.isError, blogsQuery.error?.message, prevError]);

  if (blogsQuery.isLoading) {
    return (
      <div data-testid="bloglist">
        <p>Loading Blogs</p>;
      </div>
    );
  }
  if (blogsQuery.isError) {
    return (
      <div data-testid="bloglist">
        <p>Error Getting Blogs</p>;
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

  if (blogsQuery.isSuccess) {
    return (
      <div data-testid="bloglist">
        {blogsQuery.data.map((blog) => (
          <div style={blogStyle} key={blog._id}>
            <Link to={`/blogs/${blog._id}`} style={blogListStyle}>
              <h4>{blog.title}</h4>
              <p>{`-${blog.author}`}</p>
            </Link>
          </div>
        ))}
      </div>
    );
  }
};

export default BlogList;
