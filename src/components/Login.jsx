import { useEffect } from 'react';
import { clearAuth, resetStatus, restoreUser, useAuthDispatch, useAuthValue } from '../reducers/authReducer';
import LoginForm from './LoginForm';
import Toggleable from './Toggleable';
import { notifySuccess, useToast } from './Notification';
import { STATUS } from '../utils/constants';

const Login = () => {
  const authDispatch = useAuthDispatch();

  const {
    status,
    error,
    credentials: {
      name,
      username
    }
  } = useAuthValue();

  useToast({
    status,
    toastMsg: {
      loading: 'Loading...',
      success: `${name} Has Logged In`,
      error: error || 'An Error Occured',
    },
    toastOptions: {
      id: 'auth'
    },
  });

  useEffect(() => {
    if (status === STATUS.INITIAL) {
      restoreUser(authDispatch);
    }
    if (status === STATUS.SUCCEEDED || status === STATUS.FAILED) {
      const timeout = setTimeout(() => resetStatus(authDispatch), 50);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  const handleLogout = async (e) => {
    e.preventDefault();
    window.localStorage.removeItem('loggedInBlogUser');
    clearAuth(authDispatch);
    notifySuccess('Log out Successful');
  };


  return (
    <div>
      {!username
        ? <Toggleable buttonLabel="Login">
          <LoginForm />
        </Toggleable>
        : <p>
          {name} Logged In <button onClick={handleLogout}>Logout</button>
        </p>}
    </div>
  );
};

export default Login;
