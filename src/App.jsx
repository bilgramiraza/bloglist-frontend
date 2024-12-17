import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { notify } from '../reducers/notificationReducer';
import { initializeBlogs } from '../reducers/blogsReducer';
import { setUser } from '../reducers/userReducer';
import Notification from './components/Notification';
import Login from './components/Login';
import Blogs from './components/Blogs';
import Users from './components/Users';

const App = () => {
  const dispatch = useDispatch();

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

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <Login />
      <Routes>
        <Route path='/' element={<Blogs />} />
        <Route path='/users' element={<Users />} />
      </Routes>
    </div >
  );
};

export default App;
