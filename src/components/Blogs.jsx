import { useRef } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import Blog from "./Blog";

function Blogs() {
  const user = useSelector(state => state.auth);
  const blogFormRef = useRef();

  return (
    <div>
      {user.name === null ? null : (
        <Toggleable buttonLabel="Create New Blog" ref={blogFormRef}>
          <BlogForm onClose={() => blogFormRef.current.hideComponent()} />
        </Toggleable>
      )}
      <Routes>
        <Route path='/blogs/:id' element={<Blog />} />
        <Route path='/' element={<BlogList />} />
      </Routes>
    </div>
  );
}

export default Blogs;
