import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../reducers/notificationReducer";
import { initializeUsers } from "../reducers/usersReducer";
import { Routes, Route } from 'react-router-dom';
import UsersSummary from "./UsersSummary";
import UserBlogList from "./UserBlogList";

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
      <Routes>
        <Route path='/:id' element={<UserBlogList />} />
        <Route path='/' element={<UsersSummary />} />
      </Routes>
    </div>
  );
}

export default Users;
