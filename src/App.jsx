import { useEffect, useRef } from 'react';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Toggleable from './components/Toggleable';
import { notify, useNotificationDispatch } from './reducers/notificationReducer';
import { clearUser, setUser, useUserDispatch, useUserValue } from './reducers/userReducer';

const App = () => {
  const { name, username } = useUserValue();

  const blogFormRef = useRef();

  const notifyDispatch = useNotificationDispatch();
  const userDispatch = useUserDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const credentials = JSON.parse(loggedUserJSON);
      setUser(userDispatch, credentials);
      notify(notifyDispatch, `${credentials.name} Has Logged In`);
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    window.localStorage.removeItem('loggedInBlogUser');
    clearUser(userDispatch);
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
