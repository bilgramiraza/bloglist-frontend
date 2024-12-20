import { useSelector } from "react-redux";

function UsersSummary() {
  const users = useSelector(state => state.users);

  const userTable = users === null
    ? (<tr></tr>)
    : users.map(user => {
      return (
        <tr key={user.id}>
          <td>{user.username}</td>
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
