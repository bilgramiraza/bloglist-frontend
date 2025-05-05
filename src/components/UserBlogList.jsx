import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectBlogsByUserId } from "../reducers/usersReducer";

function UserBlogList() {
  const id = useParams().id;

  const userBlogs = useSelector(state => selectBlogsByUserId(state, id));

  if (!userBlogs)
    return null;

  const userBlogsList = userBlogs.blogs.map(blog =>
    <li key={blog.id}>
      {blog.title}
    </li>
  );

  return (
    <div>
      <h4>{userBlogs.name}</h4>
      <ul>
        {userBlogsList}
      </ul>
    </div>
  );
}

export default UserBlogList;
