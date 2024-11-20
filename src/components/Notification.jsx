import { useNotificationValue } from '../reducers/notificationReducer';

function Notification() {
  const { message, status } = useNotificationValue();
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
