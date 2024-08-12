function Notification({ message, status }) {
  if (!message) return null;

  return (
    <div>
      <div>
        <span style={{ padding: "2px", borderStyle: "solid", borderWidth: "2px", borderColor: status ? "green" : "red", borderRadius: "5px" }}>
          {message}
        </span>
      </div>
    </div>
  );
}

export default Notification;
