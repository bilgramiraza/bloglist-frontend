import { useState, useEffect, useRef } from 'react';
import { remove, sendLike, setToken } from './services/blogs';
import { login } from './services/login';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Toggleable from './components/Toggleable';
import { useDispatch } from 'react-redux';
import { notify } from '../reducers/notificationReducer';
import { initializeBlogs } from '../reducers/blogsReducer';

const App = () => {
  const [blogs, setBlogs] = useState(null);
  const [user, setUser] = useState(null);
  const [reSortBlogs, setReSortBlogs] = useState(false);

  const dispatch = useDispatch();
  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      setToken(user.token);
      dispatch(notify(`${user.name} Has Logged In`));
    }
  }, []);

  const handleLogin = async ({ username, password }) => {
    try {
      const credentials = await login({ username, password });
      setUser(credentials);
      window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
      setToken(credentials.token);
      dispatch(notify(`${credentials.name} Has Logged In`));
    } catch (err) {
      dispatch(notify(err.response.data.error, false, 3));
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    window.localStorage.removeItem('loggedInBlogUser');
    setUser(null);
    setToken(null);
    dispatch(notify('Log out Successful'));
  };

  const handleLikes = async (blog) => {
    try {
      const likedBlog = await sendLike(blog);
      const modifiedBlogList = blogs.map((blog) => (blog._id === likedBlog._id ? likedBlog : blog));
      setBlogs(modifiedBlogList);
      setReSortBlogs(true);
      dispatch(notify(`Blog(${likedBlog.title}) Liked Successfully`));
    } catch (err) {
      dispatch(notify(err.response.data.error, false, 3));
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user === null ? (
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
          <BlogList
            handleLikes={handleLikes}
            user={user}
          />
        </>
      )}
    </div>
  );
};

export default App;
