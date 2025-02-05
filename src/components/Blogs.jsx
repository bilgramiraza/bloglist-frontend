import { useRef } from 'react';
import { useAuthValue } from '../reducers/authReducer';
import BlogList from './BlogList';
import BlogForm from './BlogForm';
import Toggleable from './Toggleable';

const Blogs = () => {
  const { username } = useAuthValue();

  const blogFormRef = useRef();

  return (
    <div>
      {username === null ? null : (
        <Toggleable buttonLabel="Create New Blog" ref={blogFormRef}>
          <BlogForm onClose={() => blogFormRef.current.hideComponent()} />
        </Toggleable>
      )}
      <BlogList />
    </div>
  );
};

export default Blogs;
