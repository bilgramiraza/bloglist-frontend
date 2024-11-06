import { useSelector } from 'react-redux';

function Notification() {
  const { message, status } = useSelector(state => state.notification);

  if (!message) return null;

  return (
    <div data-testid="notification">
      <span
        style={{
          padding: '2px',
          borderStyle: 'solid',
          borderWidth: '2px',
          borderColor: status ? 'green' : 'red',
          borderRadius: '5px'
        }}
      >
        {message}
      </span>
    </div>
  );
}

export default Notification;
