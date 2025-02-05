import { useEffect } from 'react';
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';
import { clearAuth, setAuth, useAuthDispatch, useAuthValue } from '../reducers/authReducer';
import LoginForm from './LoginForm';
import Toggleable from './Toggleable';

const Login = () => {
  const notifyDispatch = useNotificationDispatch();
  const authDispatch = useAuthDispatch();

  const { name, username } = useAuthValue();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const credentials = JSON.parse(loggedUserJSON);
      setAuth(authDispatch, credentials);
      notify(notifyDispatch, `${credentials.name} Has Logged In`);
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    window.localStorage.removeItem('loggedInBlogUser');
    clearAuth(authDispatch);
    notify(notifyDispatch, 'Log out Successful');
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
