import { Link } from "react-router-dom";
import { useGetAllUsersQuery } from "../services/users";

function UsersSummary() {
  const {
    data: users,
    isLoading: usersLoadingStatus,
    isError: usersErrorStatus
  } = useGetAllUsersQuery();

  if (usersLoadingStatus) {
    return (
      <div>
        <p>Loading Users...</p>
      </div>
    );
  }

  if (usersErrorStatus) {
    return (
      <div>
        <p>Error Loading Users</p>
      </div>
    );
  }

  const userTable = users === null
    ? (<tr></tr>)
    : users.map(user => {
      return (
        <tr key={user.id}>
          <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
          <td>{user.blogs.length}</td>
        </tr>);
    });

  return (
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
  );
}

export default UsersSummary;
