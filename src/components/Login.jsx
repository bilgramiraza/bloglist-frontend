import { useEffect } from 'react';
import { logoutUser, resetLoginStatus, resetLogoutStatus, resetRestoreStatus, restoreUser, useAuthDispatch, useAuthValue } from '../reducers/authReducer';
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
    error,
    credentials: {
      name,
      username
    }
  } = useAuthValue();

  useToast({
    status: loginStatus,
    toastMsg: {
      loading: 'Logging In...',
      success: `${name} Logged in Successfully`,
      error: error || 'An Error Occured',
    },
    toastOptions: {
      id: 'login'
    },
    resetFn: () => resetLoginStatus(authDispatch),
  });

  useToast({
    status: restoreStatus,
    toastMsg: {
      loading: 'Logging In...',
      success: `${name} Has Logged In`,
      error: error || 'An Error Occured',
    },
    toastOptions: {
      id: 'restore'
    },
    resetFn: () => resetRestoreStatus(authDispatch),
  });

  useToast({
    status: logoutStatus,
    toastMsg: {
      loading: 'Logging out...',
      success: 'Log out Successful',
      error: error || 'An Error Occured',
    },
    toastOptions: {
      id: 'logout'
    },
    resetFn: () => resetLogoutStatus(authDispatch),
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
