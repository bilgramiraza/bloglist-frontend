import { Routes, Route } from 'react-router-dom';
import Notification from './components/Notification';
import Blogs from './components/Blogs';
import Users from './components/Users';
import NavigationBar from './components/NavigationBar';
import LoginForm from './components/LoginForm';

const App = () => {

  return (
    <div>
      <h2>blogs</h2>
      <NavigationBar />
      <Notification />
      <Routes>
        <Route path='/*' element={<Blogs />} />
        <Route path='/users/*' element={<Users />} />
        <Route path='/login' element={<LoginForm />} />
      </Routes>
    </div >
  );
};

export default App;
