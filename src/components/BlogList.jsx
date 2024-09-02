import PropTypes from 'prop-types';
import Blog from './Blog';

const BlogList = ({ blogs, handleLikes, handleDeletes, user }) => {
  let listOfBlogs;
  if (!blogs || !blogs.length) {
    listOfBlogs = null;
  } else {
    listOfBlogs = blogs
      .map(blog => <Blog key={blog._id} blog={blog} handleLikes={handleLikes} handleDelete={handleDeletes} currentUser={user} />);
  }
  return (
    <div>
      {listOfBlogs}
    </div>
  );
};

export default BlogList;

BlogList.propTypes = {
  blogs: PropTypes.array,
  handleLikes: PropTypes.func.isRequired,
  handleDeletes: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

