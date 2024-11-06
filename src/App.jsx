import { useState, useEffect, useRef } from 'react';
import { create, getAll, remove, sendLike, setToken } from './services/blogs';
import { login } from './services/login';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Toggleable from './components/Toggleable';
import { useDispatch } from 'react-redux';
import { notify } from '../reducers/notificationReducer';

const getBlogs = async (setBlogs, dispatch) => {
  try {
    const blogs = await getAll();
    setBlogs(blogs);
  } catch (err) {
    dispatch(notify(err.response.data.error, false, 3));
  }
};

const App = () => {
  const [blogs, setBlogs] = useState(null);
  const [user, setUser] = useState(null);
  const [reSortBlogs, setReSortBlogs] = useState(false);

  const dispatch = useDispatch();

  const blogFormRef = useRef();

  useEffect(() => {
    if (blogs === null) {
      getBlogs(setBlogs, dispatch);
      setReSortBlogs(true);
    }
    if (reSortBlogs && blogs?.length) {
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

  const handleCreation = async (newBlog) => {
    try {
      const savedBlog = await create(newBlog);
      setBlogs([...blogs, savedBlog]);
      setReSortBlogs(true);
      dispatch(notify(`Blog(${savedBlog.title}) Created Successfully`));
      blogFormRef.current.hideComponent();
    } catch (err) {
      dispatch(notify(err.response.data.error, false, 3));
    }
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

  const handleDeletes = async (blogId) => {
    const targetBlog = blogs.find((blog) => blog._id === blogId);
    const deleteConfirm = window.confirm(`Delete ${targetBlog.title} By ${targetBlog.author}?`);
    if (!deleteConfirm) return;
    try {
      await remove(blogId);
      const modifiedBlogList = blogs.filter((blog) => blog._id !== blogId);
      setBlogs(modifiedBlogList);
      setReSortBlogs(true);
      dispatch(notify(`Blog(${targetBlog.title} By ${targetBlog.author}) Deleted Successfully`));
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
            <BlogForm handleCreation={handleCreation} />
          </Toggleable>
          <BlogList
            blogs={blogs}
            handleLikes={handleLikes}
            handleDeletes={handleDeletes}
            user={user}
          />
        </>
      )}
    </div>
  );
};

export default App;
