import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAll } from "../services/users";
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';
import { Link } from "react-router-dom";

const UserList = () => {
  let userTable = null;
  const dispatch = useNotificationDispatch();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAll,
    retry: false,
    throwOnError: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (usersQuery.isError) {
      notify(dispatch, usersQuery.error.message || 'An Error Occured', false, 5);
    }
  }, [dispatch, notify, usersQuery.error]);

  if (usersQuery.isLoading) {
    userTable = <tr><td>Loading Users</td></tr>;
  }
  if (usersQuery.isError) {
    userTable = <tr><td>Error Getting Users</td></tr>;
  }
  if (usersQuery.isSuccess) {
    userTable = usersQuery.data === null
      ? (<tr></tr>)
      : usersQuery.data?.map(user => (
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
