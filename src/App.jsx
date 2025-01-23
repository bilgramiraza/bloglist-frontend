import { useEffect, useRef } from 'react';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Toggleable from './components/Toggleable';
import { notify, useNotificationDispatch } from './reducers/notificationReducer';
import { clearAuth, setAuth, useAuthDispatch, useAuthValue } from './reducers/authReducer';

const App = () => {
  const { name, username } = useAuthValue();

  const blogFormRef = useRef();

  const notifyDispatch = useNotificationDispatch();
  const authDispatch = useAuthDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const credentials = JSON.parse(loggedUserJSON);
      setAuth(authDispatch, credentials);
      notify(notifyDispatch, `${credentials.name} Has Logged In`);
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    window.localStorage.removeItem('loggedInBlogUser');
    clearAuth(authDispatch);
    notify(notifyDispatch, 'Log out Successful');
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {username === null ? (
        <Toggleable buttonLabel="Login">
          <LoginForm />
        </Toggleable>
      ) : (
        <>
          <p>
            {name} Logged In <button onClick={handleLogout}>Logout</button>
          </p>
          <Toggleable buttonLabel="Create New Blog" ref={blogFormRef}>
            <BlogForm onClose={() => blogFormRef.current.hideComponent()} />
          </Toggleable>
        </>
      )}
      <BlogList />
    </div>
  );
};

export default App;
