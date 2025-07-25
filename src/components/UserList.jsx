import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAll } from "../services/users";
import { Link } from "react-router-dom";
import { notifyError } from "./Notification";

const UserList = () => {
  let userTable = null;
  const [prevError, setPrevError] = useState(null);

  const {
    isLoading: usersLoadingStatus,
    isSuccess: usersSuccessStatus,
    data: users,
    isError: usersErrorStatus,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAll,
    retry: false,
    throwOnError: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (usersErrorStatus && usersError?.message !== prevError) {
      notifyError(usersError.message || 'An Error Occured');
      setPrevError(usersError.message);
    }
  }, [usersErrorStatus, usersError?.message, prevError]);

  if (usersLoadingStatus) {
    userTable = <tr><td>Loading Users</td></tr>;
  }
  if (usersErrorStatus) {
    userTable = <tr><td>Error Getting Users</td></tr>;
  }
  if (usersSuccessStatus) {
    userTable = users === null
      ? (<tr></tr>)
      : users?.map(user => (
        <tr key={user.id}>
          <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
          <td>{user.blogs.length}</td>
        </tr>
      ));
  }
  return (
    <div>
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {userTable}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
