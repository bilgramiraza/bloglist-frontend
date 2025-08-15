import { useEffect, useState } from 'react';
import { loginUser, useAuthDispatch, useAuthValue } from '../reducers/authReducer';
import { STATUS } from '../utils/constants';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const authDispatch = useAuthDispatch();

  const {
    status: {
      login: loginStatus,
    },
  } = useAuthValue();

  useEffect(() => {
    if (loginStatus === STATUS.SUCCEEDED) {
      setUsername('');
      setPassword('');
    }
  }, [loginStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(authDispatch, username, password);
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
      </form>
    </div>
  );
};

export default LoginForm;
