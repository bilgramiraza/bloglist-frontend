import { Routes, Route } from 'react-router-dom';
import UsersSummary from "./UsersSummary";
import UserBlogList from "./UserBlogList";

function Users() {
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
