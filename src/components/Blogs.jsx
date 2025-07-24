import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import Blog from "./Blog";
import { useGetAllBlogsQuery } from "../services/blogs";
import { notifyError, notifySuccess } from "./Notification";

function Blogs() {
  const user = useSelector(state => state.auth);
  const blogFormRef = useRef();

  const {
    error,
    isError,
    isSuccess,
  } = useGetAllBlogsQuery();

  const didToastRef = useRef(false);

  useEffect(() => {
    if (isError && !didToastRef.current) {
      notifyError(error || 'Error fetching blogs');
      didToastRef.current = true;
    } else if (isSuccess && !didToastRef.current) {
      notifySuccess('Fetched blogs successfully');
      didToastRef.current = true;
    }
  }, [isError, isSuccess, error]);

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
