import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { notify } from '../../reducers/notificationReducer';
import { loginUser } from '../../reducers/authReducer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = await dispatch(loginUser(username, password));
      window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
      dispatch(notify(`${credentials.name} Has Logged In`));
      setUsername('');
      setPassword('');
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 5));
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
