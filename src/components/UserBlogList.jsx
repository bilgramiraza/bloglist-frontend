import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetAllUsersQuery } from "../services/users";
import { notify } from "../reducers/notificationReducer";

function UserBlogList() {
  const id = useParams().id;
  const [prevError, setPrevError] = useState(null);

  const {
    data: users,
    error: usersError,
    isLoading: usersLoadingStatus,
    isError: usersErrorStatus
  } = useGetAllUsersQuery();

  const userBlogs = users?.find((user) => user.id === id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (usersErrorStatus && usersError !== prevError) {
      dispatch(notify(usersError || 'An Error Occured', false, 3));
      setPrevError(usersError);
    }
  }, [dispatch, usersErrorStatus, usersError, prevError]);

  if (!userBlogs && !(usersLoadingStatus || usersErrorStatus))
    return (
      <div>
        <p>User Not Found</p>
      </div>
    );

  const userBlogsList = userBlogs?.blogs.map(blog =>
    <li key={blog.id}>
      {blog.title}
    </li>
  );

  if (usersLoadingStatus) {
    return (
      <div>
        <p>Loading User Details...</p>
      </div>
    );
  }

  if (usersErrorStatus) {
    return (
      <div>
        <p>Error Loading User Details</p>
      </div>
    );
  }

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
