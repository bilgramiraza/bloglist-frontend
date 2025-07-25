import { toast, Toaster } from "sonner";

function Notification() {
  return (
    <Toaster
      richColors={true}
      visibleToasts={9}
      position="top-right"
    />
  );
}

export const notifySuccess = msg => toast.success(msg, { duration: 3000 });

export const notifyError = msg => toast.error(msg, { duration: 5000 });

export default Notification;
