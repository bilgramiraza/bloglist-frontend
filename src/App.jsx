import { useState, useEffect, useRef } from 'react';
import { create, getAll, remove, sendLike, setToken } from './services/blogs';
import { login } from './services/login';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Toggleable from './components/Toggleable';

const getBlogs = async (setBlogs, handleNotification) => {
  try {
    const blogs = await getAll();
    setBlogs(blogs);
  } catch (err) {
    handleNotification(err.response.data.error, false);
  }
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    message: null,
    status: false,
  });
  const [reSortBlogs, setReSortBlogs] = useState(false);

  const blogFormRef = useRef();

  useEffect(() => {
    if (!blogs.length) {
      getBlogs(setBlogs, handleNotification);
      setReSortBlogs(true);
    }
    if (reSortBlogs) {
      setBlogs(blogs.toSorted((blogA, blogB) => blogB.likes - blogA.likes));
      setReSortBlogs(false);
    }
  }, [blogs, reSortBlogs]);

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
    handleNotification('Log out Successful', true);
  };

  const handleCreation = async newBlog => {
    try {
      const savedBlog = await create(newBlog);
      setBlogs([...blogs, savedBlog]);
      setReSortBlogs(true);
      handleNotification(`Blog(${savedBlog.title}) Created Successfully`, true);
      blogFormRef.current.hideComponent();
    } catch (err) {
      handleNotification(err.response.data.error, false);
    }
  };

  const handleLikes = async blog => {
    try {
      const likedBlog = await sendLike(blog);
      const modifiedBlogList = blogs.map(blog => blog._id === likedBlog._id ? likedBlog : blog);
      setBlogs(modifiedBlogList);
      setReSortBlogs(true);
      handleNotification(`Blog(${likedBlog.title}) Liked Successfully`, true);
    } catch (err) {
      handleNotification(err.response.data.error, false);
    }
  };

  const handleDeletes = async blogId => {
    const targetBlog = blogs.find(blog => blog._id === blogId);
    const deleteConfirm = window.confirm(`Delete ${targetBlog.title} By ${targetBlog.author}?`);
    if (!deleteConfirm) return;
    try {
      await remove(blogId);
      const modifiedBlogList = blogs.filter(blog => blog._id !== blogId);
      setBlogs(modifiedBlogList);
      setReSortBlogs(true);
      handleNotification(`Blog(${targetBlog.title} By ${targetBlog.author}) Deleted Successfully`, true);
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
          ? <Toggleable buttonLabel='Login'>
            <LoginForm handleLogin={handleLogin} />
          </Toggleable>
          : <>
            <p>{user.name} Logged In <button onClick={handleLogout}>Logout</button></p>
            <Toggleable buttonLabel='Create New Blog' ref={blogFormRef}>
              <BlogForm handleCreation={handleCreation} />
            </Toggleable>
            <BlogList blogs={blogs} handleLikes={handleLikes} handleDeletes={handleDeletes} user={user} />
          </>
      }
    </div>
  );
};

export default App;
