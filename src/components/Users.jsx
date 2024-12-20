import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../../reducers/notificationReducer";
import { initializeUsers } from "../../reducers/usersReducer";
import UsersSummary from "./UsersSummary";

function Users() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(initializeUsers());
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 3));
    }
  }, []);

  return (
    <div>
      <h3>Users</h3>
      <UsersSummary />
    </div>
  );
}

export default Users;
