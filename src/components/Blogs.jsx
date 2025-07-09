import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import Blog from "./Blog";
import { STATUS } from "../utils/constants";
import { fetchBlogs } from "../reducers/blogsReducer";

function Blogs() {
  const user = useSelector(state => state.auth);
  const {
    status: { fetch: status },
  } = useSelector(state => state.blogs);

  const blogFormRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === STATUS.INITIAL) dispatch(fetchBlogs());
  }, [status, dispatch]);

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
