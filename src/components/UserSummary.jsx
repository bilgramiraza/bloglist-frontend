import { useParams } from "react-router-dom";
import { notify, useNotificationDispatch } from "../reducers/notificationReducer";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "../services/users";
import { useEffect, useState } from "react";

const UserSummary = () => {
  const id = useParams().id;
  const [prevError, setPrevError] = useState(null);

  const dispatch = useNotificationDispatch();

  const userQuery = useQuery({
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
    if (userQuery.isError && userQuery.error?.message !== prevError) {
      notify(dispatch, userQuery.error.message || 'An Error Occured', false, 5);
      setPrevError(userQuery.error.message);
    }
  }, [dispatch, userQuery.isError, userQuery.error?.message, prevError]);

  if (userQuery.isLoading) {
    return (
      <div>
        <h4>Loading Blogs</h4>
      </div>
    );
  }
  if (userQuery.isError) {
    return (
      <div>
        <h4>User Not Found</h4>
      </div>
    );
  }

  return (
    <div>
      <h4>{userQuery.data?.name.toUpperCase()} Blogs</h4>
      <ul>
        {
          userQuery.data?.blogs?.length
            ? userQuery.data?.blogs?.map(blog => (
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
