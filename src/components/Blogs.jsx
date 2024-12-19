import { useRef } from "react";
import { useSelector } from "react-redux";
import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";

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
      <BlogList />
    </div>
  );
}

export default Blogs;
