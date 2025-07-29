import { getAll } from "../services/users";
import { Link } from "react-router-dom";
import { useQueryWithToast } from "./Notification";

const UserList = () => {
  let userTable = null;

  const {
    isLoading: usersLoadingStatus,
    isSuccess: usersSuccessStatus,
    data: users,
    isError: usersErrorStatus,
  } = useQueryWithToast({
    queryKey: ['users'],
    queryFn: getAll,
    toastMsg: {
      loading: 'Fetching Users...',
      success: (data) => `Successfully Fetched Users(${data.length})`,
      error: (err) => err.message || 'Error Fetching Users'
    },
  });

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
