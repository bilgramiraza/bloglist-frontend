import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../reducers/notificationReducer";
import { setUser, clearUser } from "../reducers/authReducer";
import { useLocation, useNavigate } from 'react-router-dom';

function Login() {
  const { name } = useSelector(state => state?.auth?.credentials || {});

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const credentials = JSON.parse(loggedUserJSON);
      dispatch(setUser(credentials));
      dispatch(notify(`${credentials.name} Has Logged In`));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/login', { state: { from: location }, replace: true });
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(clearUser());
    window.localStorage.removeItem('loggedInBlogUser');
    dispatch(notify('Log out Successful'));
  };

  if (location?.pathname === '/login')
    return null;

  return (
    <div>
      {name === null ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <p>
          {name} Logged In <button onClick={handleLogout}>Logout</button>
        </p>
      )}
    </div>
  );
}

export default Login;
