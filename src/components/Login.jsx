import { useEffect } from 'react';
import { asyncReset, logoutUser, restoreUser, useAuthDispatch, useAuthValue } from '../reducers/authReducer';
import LoginForm from './LoginForm';
import Toggleable from './Toggleable';
import { useToast } from './Notification';
import { STATUS } from '../utils/constants';

const Login = () => {
  const authDispatch = useAuthDispatch();

  const {
    status: {
      login: loginStatus,
      restore: restoreStatus,
      logout: logoutStatus,
    },
    error: {
      login: loginError,
      restore: restoreError,
      logout: logoutError,
    },
    credentials: {
      name,
      username
    }
  } = useAuthValue();

  useToast({
    status: loginStatus,
    toastMsg: {
      loading: 'Logging In...',
      success: `${name || 'User'} Logged in Successfully`,
      error: loginError || 'An Error Occured',
    },
    toastOptions: {
      id: 'login'
    },
    resetFn: () => asyncReset(authDispatch, 'login'),
  });

  useToast({
    status: restoreStatus,
    toastMsg: {
      loading: 'Logging In...',
      success: `${name || 'User'} Has Logged In`,
      error: restoreError || 'An Error Occured',
    },
    toastOptions: {
      id: 'restore'
    },
    resetFn: () => asyncReset(authDispatch, 'restore'),
  });

  useToast({
    status: logoutStatus,
    toastMsg: {
      loading: 'Logging out...',
      success: 'Log out Successful',
      error: logoutError || 'An Error Occured',
    },
    toastOptions: {
      id: 'logout'
    },
    resetFn: () => asyncReset(authDispatch, 'logout'),
  });

  useEffect(() => {
    if (restoreStatus === STATUS.INITIAL) {
      restoreUser(authDispatch);
    }
  }, [restoreStatus]);

  const handleLogout = (e) => {
    e.preventDefault();
    logoutUser(authDispatch);
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
