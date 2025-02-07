import { Route, Routes } from "react-router-dom";
import UserList from "./UserList";
import UserSummary from "./UserSummary";

const Users = () => {

  return (
    <div>
      <Routes>
        <Route path="/:id" element={<UserSummary />} />
        <Route path="/" element={<UserList />} />
      </Routes>
    </div>
  );
};

export default Users;
