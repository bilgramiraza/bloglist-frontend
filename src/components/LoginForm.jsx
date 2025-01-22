import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { notify } from '../../reducers/notificationReducer';
import { loginUser } from '../../reducers/authReducer';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location?.state?.from?.pathname || '/';

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
      navigate(from, { replace: true });

    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 5));
    }
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
