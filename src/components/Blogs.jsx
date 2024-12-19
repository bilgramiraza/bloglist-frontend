import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../reducers/notificationReducer";
import { initializeBlogs } from '../../reducers/blogsReducer';
import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";

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
      <BlogList />
    </div>
  );
}

export default Blogs;
