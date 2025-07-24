import { Routes, Route } from 'react-router-dom';
import UsersSummary from "./UsersSummary";
import UserBlogList from "./UserBlogList";
import { useEffect, useRef } from 'react';
import { useGetAllUsersQuery } from '../services/users';
import { notifyError, notifySuccess } from './Notification';

function Users() {
  const {
    error,
    isError,
    isSuccess,
  } = useGetAllUsersQuery();

  const didToastRef = useRef(false);

  useEffect(() => {
    if (isError && !didToastRef.current) {
      notifyError(error || 'Error fetching users');
      didToastRef.current = true;
    } else if (isSuccess && !didToastRef.current) {
      notifySuccess('Fetched users successfully');
      didToastRef.current = true;
    }
  }, [isError, isSuccess, error]);

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
