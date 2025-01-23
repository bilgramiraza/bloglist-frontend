import { useState } from 'react';
import { loginUser, useAuthDispatch } from '../reducers/authReducer';
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const notifyDispatch = useNotificationDispatch();
  const authDispatch = useAuthDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = await loginUser(authDispatch, username, password);
      window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
      notify(notifyDispatch, `${credentials.name} Has Logged In`);
      setUsername('');
      setPassword('');
    } catch (err) {
      notify(notifyDispatch, err.message || 'An Error Occured', false, 5);
    }
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
