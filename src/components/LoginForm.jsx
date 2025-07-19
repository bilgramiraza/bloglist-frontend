import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notify } from '../reducers/notificationReducer';
import { loginUser, resetStatus } from '../reducers/authReducer';
import { useLocation, useNavigate } from 'react-router-dom';
import { STATUS } from '../utils/constants';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {
    status: loginStatus,
    error,
    credentials
  } = useSelector(state => state.auth);

  useEffect(() => {
    if (loginStatus === STATUS.SUCCEEDED) {
      dispatch(notify(`${credentials.name} Has Logged In`));
      window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
      dispatch(resetStatus());
      setUsername('');
      setPassword('');
      navigate(from, { replace: true });
    }
    if (loginStatus === STATUS.FAILED) {
      dispatch(notify(error || 'An Error Occured', false, 5));
      dispatch(resetStatus());
    }
  }, [loginStatus]);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location?.state?.from?.pathname || '/';

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(from, { replace: true });
  };

  return (
    <div>
      <h2>Login to Application</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            data-testid="username"
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </label>
        <label>
          Password:
          <input
            data-testid="password"
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <button data-testid="login" type="submit">
          Login
        </button>
        <button type='button' onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
