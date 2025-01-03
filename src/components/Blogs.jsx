import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import { notify } from "../../reducers/notificationReducer";
import { initializeBlogs } from '../../reducers/blogsReducer';
import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import Blog from "./Blog";

function Blogs() {
  const user = useSelector(state => state.auth);
  const blogFormRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(initializeBlogs());
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 3));
    }
  }, []);


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
