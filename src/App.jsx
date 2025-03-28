import { Route, Routes } from 'react-router-dom';
import Blogs from './components/Blogs';
import Notification from './components/Notification';
import Users from './components/Users';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <Navbar />
      <Routes>
        <Route path='/*' element={<Blogs />} />
        <Route path='/users/*' element={<Users />} />
      </Routes>
    </div>
  );
};

export default App;
