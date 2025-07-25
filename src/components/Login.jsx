import { useEffect } from 'react';
import { clearAuth, setAuth, useAuthDispatch, useAuthValue } from '../reducers/authReducer';
import LoginForm from './LoginForm';
import Toggleable from './Toggleable';
import { notifySuccess } from './Notification';

const Login = () => {
  const authDispatch = useAuthDispatch();

  const { name, username } = useAuthValue();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const credentials = JSON.parse(loggedUserJSON);
      setAuth(authDispatch, credentials);
      notifySuccess(`${credentials.name} Has Logged In`);
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    window.localStorage.removeItem('loggedInBlogUser');
    clearAuth(authDispatch);
    notifySuccess('Log out Successful');
  };


  return (
    <div>
      {username === null ? (
        <Toggleable buttonLabel="Login">
          <LoginForm />
        </Toggleable>
      ) : (
        <p>
          {name} Logged In <button onClick={handleLogout}>Logout</button>
        </p>
      )}
    </div>
  );
};

export default Login;
