import { useState, useEffect } from 'react';
import { getAll, login } from './services/blogs';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';

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
          : blogs.map(blog => <Blog key={blog.id} blog={blog} />)
      }
    </div>
  );
};

export default App;
