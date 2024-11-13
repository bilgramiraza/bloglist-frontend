import { useEffect, useRef } from 'react';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Toggleable from './components/Toggleable';
import { useDispatch, useSelector } from 'react-redux';
import { notify } from '../reducers/notificationReducer';
import { initializeBlogs } from '../reducers/blogsReducer';
import { clearUser, loginUser, setUser } from '../reducers/userReducer';

const App = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const blogFormRef = useRef();

  useEffect(() => {
    try {
      dispatch(initializeBlogs());
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 3));
    }
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const credentials = JSON.parse(loggedUserJSON);
      dispatch(setUser(credentials));
      dispatch(notify(`${credentials.name} Has Logged In`));
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const credentials = await dispatch(loginUser(username, password));
      window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
      dispatch(notify(`${credentials.name} Has Logged In`));
    } catch (err) {
      dispatch(notify(err.message || 'An Error Occured', false, 3));
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(clearUser());
    window.localStorage.removeItem('loggedInBlogUser');
    dispatch(notify('Log out Successful'));
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user.name === null ? (
        <Toggleable buttonLabel="Login">
          <LoginForm handleLogin={handleLogin} />
        </Toggleable>
      ) : (
        <>
          <p>
            {user.name} Logged In <button onClick={handleLogout}>Logout</button>
          </p>
          <Toggleable buttonLabel="Create New Blog" ref={blogFormRef}>
            <BlogForm onClose={() => blogFormRef.current.hideComponent()} />
          </Toggleable>
          <BlogList />
        </>
      )}
    </div>
  );
};

export default App;
