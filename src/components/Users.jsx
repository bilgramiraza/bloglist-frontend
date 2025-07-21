import { Routes, Route } from 'react-router-dom';
import UsersSummary from "./UsersSummary";
import UserBlogList from "./UserBlogList";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, resetFetchStatus } from '../reducers/usersReducer';
import { STATUS } from '../utils/constants';
import { notify } from '../reducers/notificationReducer';

function Users() {
  const {
    status: { fetch: fetchStatus },
    error
  } = useSelector(state => state.users);

  const dispatch = useDispatch();
  useEffect(() => {
    if (fetchStatus === STATUS.INITIAL) dispatch(fetchUsers());
    if (fetchStatus === STATUS.SUCCEEDED) {
      dispatch(notify('Successfully Fetched Users'));
      dispatch(resetFetchStatus());
    }
    if (fetchStatus === STATUS.FAILED) {
      dispatch(notify(error || 'An Error Occured', false, 3));
      dispatch(resetFetchStatus());
    }
  }, [fetchStatus]);

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
