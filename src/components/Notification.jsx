import PropTypes from 'prop-types';

function Notification({ message, status }) {
  if (!message) return null;

  return (
    <div data-testid="notification">
      <span style={{ padding: '2px', borderStyle: 'solid', borderWidth: '2px', borderColor: status ? 'green' : 'red', borderRadius: '5px' }}>
        {message}
      </span>
    </div>
  );
}

export default Notification;

Notification.propTypes = {
  message: PropTypes.string,
  status: PropTypes.bool.isRequired,
};
