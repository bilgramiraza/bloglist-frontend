import Login from "./Login";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div>
        <p><Link to={'/'}>Blogs</Link></p>
        <p><Link to={'/users'}>Users</Link></p>
      </div>
      <div>
        <Login />
      </div>
    </div>
  );
};

export default Navbar;
