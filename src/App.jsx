import { useState, useEffect } from 'react';
import { getAll } from './services/blogs';
import { login } from './services/login';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';

const BlogList = ({ username, blogs }) => {
  return (
    <div>
      <p>{username} Logged In</p>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getAll()
      .then(blogs =>
        setBlogs(blogs)
      );
  }, []);

  const handleLogin = async ({ username, password }) => {
    const credentials = await login({ username, password });
    setUser(credentials);
  };

  return (
    <div>
      <h2>blogs</h2>
      {
        user === null
          ? <LoginForm handleLogin={handleLogin} />
          : <BlogList username={user.name} blogs={blogs} />
      }
    </div>
  );
};

export default App;
