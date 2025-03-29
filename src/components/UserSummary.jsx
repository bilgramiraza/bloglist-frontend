import { useParams } from "react-router-dom";
import { notify, useNotificationDispatch } from "../reducers/notificationReducer";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "../services/users";
import { useEffect, useState } from "react";

const UserSummary = () => {
  const id = useParams().id;
  const [prevError, setPrevError] = useState(null);

  const dispatch = useNotificationDispatch();

  const {
    isLoading: userLoadingStatus,
    data: user,
    isError: userErrorStatus,
    error: userError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAll,
    select: (users) => {
      const target = users.find((user) => user.id === id);
      if (!target)
        throw new Error('User Not Found');
      return target;
    },
    retry: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (userErrorStatus && userError?.message !== prevError) {
      notify(dispatch, userError.message || 'An Error Occured', false, 5);
      setPrevError(userError.message);
    }
  }, [dispatch, userErrorStatus, userError?.message, prevError]);

  if (userLoadingStatus) {
    return (
      <div>
        <h4>Loading Blogs</h4>
      </div>
    );
  }
  if (userErrorStatus) {
    return (
      <div>
        <h4>User Not Found</h4>
      </div>
    );
  }

  return (
    <div>
      <h4>{user?.name?.toUpperCase()} Blogs</h4>
      <ul>
        {
          user?.blogs?.length
            ? user?.blogs?.map(blog => (
              <li key={blog.id}>{blog.title}</li>
            ))
            : (
              <li>No Blogs Found</li>
            )
        }
      </ul>
    </div>
  );
};

export default UserSummary;
