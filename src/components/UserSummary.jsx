import { useParams } from "react-router-dom";
import { notify, useNotificationDispatch } from "../reducers/notificationReducer";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "../services/users";
import { useEffect } from "react";

const UserSummary = () => {
  const id = useParams().id;
  let blogsList = null;

  const dispatch = useNotificationDispatch();

  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAll,
    select: (users) => {
      const target = users.filter((user) => user.id === id);
      return target[0];
    },
    retry: false,
    throwOnError: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (userQuery.isError) {
      notify(dispatch, userQuery.error.message || 'An Error Occured', false, 5);
    }
  }, [dispatch, notify, userQuery.error]);

  if (userQuery.isLoading) {
    blogsList = <li>Loading Blogs</li>;
  }
  if (userQuery.isError) {
    blogsList = <li>Error Getting Blogs</li>;
  }
  if (userQuery.isSuccess) {
    blogsList = userQuery.data === null
      ? (<li></li>)
      : userQuery.data?.blogs.map(blog => (
        <li key={blog.id}>{blog.title}</li>
      ));
  }

  return (
    <div>
      <h4>{userQuery.data?.name.toUpperCase()} Blogs</h4>
      <ul>
        {blogsList}
      </ul>
    </div>
  );
};

export default UserSummary;
