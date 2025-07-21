import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../reducers/notificationReducer";
import { logoutUser, resetStatus, restoreUser } from "../reducers/authReducer";
import { useLocation, useNavigate } from 'react-router-dom';
import { STATUS } from '../utils/constants';

function Login() {
  const {
    credentials,
    status,
  } = useSelector(state => state.auth);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === STATUS.INITIAL) {
      dispatch(restoreUser());
    }
    if (status === STATUS.SUCCEEDED && credentials?.name) {
      dispatch(notify(`${credentials.name} Has Logged In`));
    }
    if (status === STATUS.SUCCEEDED || status === STATUS.FAILED) {
      dispatch(resetStatus())
    }
  }, [status]);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/login', { state: { from: location }, replace: true });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    dispatch(notify('Log out Successful'));
  };

  if (location?.pathname === '/login')
    return null;

  return (
    <div>
      {credentials?.name === null ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <p>
          {credentials?.name} Logged In <button onClick={handleLogout}>Logout</button>
        </p>
      )}
    </div>
  );
}

export default Login;
