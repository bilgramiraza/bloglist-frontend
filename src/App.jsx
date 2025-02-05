import Blogs from './components/Blogs';
import Login from './components/Login';
import Notification from './components/Notification';

const App = () => {
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <Login />
      <Blogs />
    </div>
  );
};

export default App;
