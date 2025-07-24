import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification() {
  return (
    <ToastContainer
      autoClose={3000}
      closeButton={false}
      closeOnClick={true}
      newestOnTop={true}
    />);
}
export default Notification;

export const notifySuccess = msg => toast.success(msg, { autoClose: 3000 });

export const notifyError = msg => toast.error(msg, { autoClose: 5000 });
