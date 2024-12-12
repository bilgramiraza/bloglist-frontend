import PropTypes from 'prop-types';
import Blog from './Blog';
import { getAll } from '../services/blogs';
import { useQuery } from '@tanstack/react-query';
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';
import { useEffect } from 'react';

const BlogList = ({ user }) => {
  let listOfBlogs = null;
  const dispatch = useNotificationDispatch();

  const blogsQuery = useQuery({
    queryKey: ['blogList'],
    queryFn: getAll,
    retry: false,
    select: blogs => blogs.toSorted((blogA, blogB) => blogB.likes - blogA.likes),
    throwOnError: false,
  });

  useEffect(() => {
    if (blogsQuery.isError) {
      notify(dispatch, blogsQuery.error?.response?.data?.error, false, 5);
    }
  }, [dispatch, notify, blogsQuery.error]);

  if (blogsQuery.isLoading) {
    listOfBlogs = <p>Loading Blogs</p>;
  }
  if (blogsQuery.isError) {
    listOfBlogs = <p>Error Getting Blogs</p>;
  }
  if (blogsQuery.isSuccess) {
    listOfBlogs = blogsQuery.data.map((blog) => (
      <Blog
        key={blog._id}
        blog={blog}
        currentUser={user}
      />
    ));
  }

  return (
    <div data-testid="bloglist">
      {listOfBlogs}
    </div>
  );
};

export default BlogList;

BlogList.propTypes = {
  user: PropTypes.object.isRequired
};
