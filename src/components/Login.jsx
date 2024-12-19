import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../reducers/notificationReducer";
import { setUser, clearUser, loginUser } from "../../reducers/authReducer";
import Toggleable from "./Toggleable";
import LoginForm from "./LoginForm";

function Login() {
  const user = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const credentials = JSON.parse(loggedUserJSON);
      dispatch(setUser(credentials));
      dispatch(notify(`${credentials.name} Has Logged In`));
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const credentials = await dispatch(loginUser(username, password));
      window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
      dispatch(notify(`${credentials.name} Has Logged In`));
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 5));
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(clearUser());
    window.localStorage.removeItem('loggedInBlogUser');
    dispatch(notify('Log out Successful'));
  };
  return (
    <div>
      {user.name === null ? (
        <Toggleable buttonLabel="Login">
          <LoginForm handleLogin={handleLogin} />
        </Toggleable>
      ) : (
        <p>
          {user.name} Logged In <button onClick={handleLogout}>Logout</button>
        </p>
      )}
    </div>
  );
}

export default Login;
