import { useRef } from 'react';
import { useAuthValue } from '../reducers/authReducer';
import BlogList from './BlogList';
import BlogForm from './BlogForm';
import Toggleable from './Toggleable';
import { Route, Routes } from 'react-router-dom';

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
      <Routes>
        {/* <Route path="/blogs/:id" element={< />} />*/}
        <Route path="/" element={<BlogList />} />
      </Routes>
    </div>
  );
};

export default Blogs;
