import { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>Login to Application</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input data-testid="username" type="text" name="username" value={username} onChange={handleUsernameChange} />
        </label>
        <label>
          Password:
          <input data-testid="password" type="password" name="password" value={password} onChange={handlePasswordChange} />
        </label>
        <button data-testid="login" type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};
