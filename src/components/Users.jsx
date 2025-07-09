import { Routes, Route } from 'react-router-dom';
import UsersSummary from "./UsersSummary";
import UserBlogList from "./UserBlogList";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../reducers/usersReducer';
import { STATUS } from '../utils/constants';

function Users() {
  const dispatch = useDispatch();
  const {
    status: { fetch: fetchStatus },
  } = useSelector(state => state.users);

  useEffect(() => {
    if (fetchStatus === STATUS.INITIAL) dispatch(fetchUsers());
  }, [fetchStatus, dispatch]);


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
