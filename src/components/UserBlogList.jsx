import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserById } from "../reducers/usersReducer";
import { useEffect } from "react";
import { notify } from "../reducers/notificationReducer";
import { STATUS } from "../utils/constants";

function UserBlogList() {
  const id = useParams().id;
  const dispatch = useDispatch();

  const {
    status: { fetch: fetchStatus },
    error,
    user
  } = useSelector(state => selectUserById(state, id));

  useEffect(() => {
    if (fetchStatus === STATUS.FAILED) dispatch(notify(error || 'An Error Occured', false, 3));
  }, [fetchStatus, dispatch]);


  if (fetchStatus === STATUS.LOADING) {
    return (
      <div>
        <h4></h4>
        <p>Loading User Details...</p>
      </div>
    );
  }

  if (fetchStatus === STATUS.FAILED) {
    return (
      <div>
        <h4></h4>
        <p>Failed to Load User Details due to error:{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h4></h4>
        <p>Unable to Fetch User</p>
      </div>
    );
  }

  if (!user.blogs.length) {
    return (
      <div>
        <h4>{user.name}</h4>
        <p>No Blogs to Display</p>
      </div>
    );
  }

  const userBlogsList = user.blogs.map(blog =>
    <li key={blog.id}>
      {blog.title}
    </li>
  );

  return (
    <div>
      <h4>{user.name}</h4>
      <ul>
        {userBlogsList}
      </ul>
    </div>
  );
}

export default UserBlogList;
