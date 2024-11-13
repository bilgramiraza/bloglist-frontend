import Blog from './Blog';
import { useSelector } from 'react-redux';
import { selectSortedBlogs } from '../../reducers/blogsReducer';

const BlogList = () => {
  const blogs = useSelector(selectSortedBlogs);
  let listOfBlogs;
  if (!blogs || !blogs.length) {
    listOfBlogs = null;
  } else {
    listOfBlogs = blogs.map((blog) => (
      <Blog
        key={blog._id}
        blog={blog}
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
