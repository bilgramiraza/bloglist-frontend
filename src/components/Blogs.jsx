import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import Blog from "./Blog";
import { STATUS } from "../utils/constants";
import { fetchBlogs, resetFetchStatus } from "../reducers/blogsReducer";
import { notify } from "../reducers/notificationReducer";

function Blogs() {
  const user = useSelector(state => state.auth);
  const {
    status: { fetch: status },
    error,
  } = useSelector(state => state.blogs);

  const blogFormRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === STATUS.INITIAL) dispatch(fetchBlogs());
    if (status === STATUS.SUCCEEDED) {
      dispatch(notify('Successfully Fetched Blogs'));
      dispatch(resetFetchStatus());
    }
    if (status === STATUS.FAILED) {
      dispatch(notify(error || 'An Error Occured', false, 5));
      dispatch(resetFetchStatus());
    }
  }, [status]);

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
