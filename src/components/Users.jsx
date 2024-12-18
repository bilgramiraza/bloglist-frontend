import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAll } from "../services/users";
import { notify } from "../../reducers/notificationReducer";

function Users() {
  const [users, setUsers] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const data = await getAll();
        setUsers(data);
      } catch (err) {
        dispatch(notify(err.message || 'An Error Occured', false, 3));
      }
    })();
  }, []);

  const userTable = users === null
    ? (<tr></tr>)
    : users.map(user => {
      return (
        <tr key={user._id}>
          <td>{user.username}</td>
          <td>{user.blogs}</td>
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
