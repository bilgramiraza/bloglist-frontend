import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { STATUS } from "../utils/constants";

function UsersSummary() {
  const {
    status: { fetch: fetchStatus },
    error,
    items: users
  } = useSelector(state => state.users);

  if (fetchStatus === STATUS.LOADING) {
    return (
      <div>
        <h4></h4>
        <p>Loading Users...</p>
      </div>
    );
  }

  if (fetchStatus === STATUS.FAILED) {
    return (
      <div>
        <h4></h4>
        <p>Failed to Load Users due to error:{error}</p>
      </div>
    );
  }

  if (!users) {
    return (
      <div>
        <h4></h4>
        <p>Unable to Fetch Users</p>
      </div>
    );
  }

  const userTable = users === null
    ? (<tr><td>No Users Found</td></tr>)
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
