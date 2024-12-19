import { Routes, Route } from 'react-router-dom';
import Notification from './components/Notification';
import Login from './components/Login';
import Blogs from './components/Blogs';
import Users from './components/Users';

const App = () => {

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
