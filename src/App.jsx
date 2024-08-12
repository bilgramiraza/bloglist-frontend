import { useState, useEffect } from 'react';
import { create, getAll, setToken } from './services/blogs';
import { login } from './services/login';
import BlogList from './components/Blog';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    message: null,
    status: false,
  });

  useEffect(() => {
    try {
      getAll()
        .then(blogs =>
          setBlogs(blogs)
        );
    } catch (err) {
      handleNotification(err.response.data.error, false);
    }
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      setToken(user.token);
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
      setToken(credentials.token);
      handleNotification(`${credentials.name} Has Logged In`, true);
    } catch (err) {
      handleNotification(err.response.data.error, false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    window.localStorage.removeItem('loggedInBlogUser');
    setUser(null);
    setToken(null);
    handleNotification(" Log out Successful", true);
  };

  const handleCreation = async newBlog => {
    try {
      const savedBlog = await create(newBlog);
      setBlogs([...blogs, savedBlog]);
      handleNotification(`Blog(${savedBlog.title}) Created Successfully`, true);
    } catch (err) {
      handleNotification(err.response.data.error, false);
    }
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
            <BlogForm handleCreation={handleCreation} />
            <BlogList blogs={blogs} />
          </>
      }
    </div>
  );
};

export default App;
