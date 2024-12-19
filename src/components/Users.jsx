import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../reducers/notificationReducer";
import { initializeUsers } from "../../reducers/usersReducer";

function Users() {
  const users = useSelector(state => state.users);

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(initializeUsers());
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 3));
    }
  }, []);

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
}

export default Users;
