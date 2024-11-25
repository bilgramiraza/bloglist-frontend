import PropTypes from 'prop-types';
import Blog from './Blog';
import { getAll } from '../services/blogs';
import { useQuery } from '@tanstack/react-query';
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';

const BlogList = ({ handleLikes, handleDeletes, user }) => {
  const dispatch = useNotificationDispatch();

  const blogsQuery = useQuery({
    queryKey: ['blogList'],
    queryFn: getAll,
    retry: false,
    select: blogs => blogs.toSorted((blogA, blogB) => blogB.likes - blogA.likes),
    throwOnError: (err) => notify(dispatch, err.response.data.error, false, 5),
  });

  if (blogsQuery.isLoading) {
    return (
      <div data-testid="bloglist">
        <p>Loading Blogs</p>
      </div>
    );
  };
  if (blogsQuery.isError) {
    return (
      <div data-testid="bloglist">
        <p>Error Getting Blogs</p>
      </div>
    );
  }
  if (blogsQuery.isSuccess) {
    const listOfBlogs = blogsQuery.data.map((blog) => (
      <Blog
        key={blog._id}
        blog={blog}
        handleLikes={handleLikes}
        handleDelete={handleDeletes}
        currentUser={user}
      />
    ));
    return (
      <div data-testid="bloglist">
        {listOfBlogs}
      </div>
    );
  }
};

export default BlogList;

BlogList.propTypes = {
  handleLikes: PropTypes.func.isRequired,
  handleDeletes: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
