import { useState, useEffect } from 'react';
import { getAll } from './services/blogs';
import { login } from './services/login';
import BlogList from './components/Blog';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    message: null,
    status: false,
  });

  useEffect(() => {
    getAll()
      .then(blogs =>
        setBlogs(blogs)
      );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      handleNotification(`${user.name} Has Logged In`, true);
    }
  }, []);

  const handleNotification = (message, status) => {
    setNotification({ message, status });
    setTimeout(() => setNotification(notif => ({ ...notif, message: '' })), 5000);
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const credentials = await login({ username, password });
      setUser(credentials);
      window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
      handleNotification(`${credentials.name} Has Logged In`, true);
    } catch (err) {
      handleNotification(err.message, false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    window.localStorage.removeItem('loggedInBlogUser');
    setUser(null);
    handleNotification(" Log out Successful", true);
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} status={notification.status} />
      {
        user === null
          ? <LoginForm handleLogin={handleLogin} />
          : <>
            <p>{user.name} Logged In <button onClick={handleLogout}>Logout</button></p>
            <BlogList blogs={blogs} />
          </>
      }
    </div>
  );
};

export default App;
