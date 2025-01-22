import { Link } from "react-router-dom";
import Login from './Login';

function NavigationBar() {
  const navBarStyle = {
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
  };
  const linksStyle = {
    width: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };
  return (
    <div style={navBarStyle}>
      <div style={linksStyle}>
        <p><Link to={'/'}>Blogs</Link></p>
        <p><Link to={'/users'}>Users</Link></p>
      </div>
      <div>
        <Login />
      </div>
    </div>
  );
}

export default NavigationBar;
