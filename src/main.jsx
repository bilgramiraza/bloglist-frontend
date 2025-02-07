import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificationContextProvider } from './reducers/notificationReducer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from './reducers/authReducer';
import { UserContextProvider } from './reducers/userReducer';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <AuthContextProvider>
        <UserContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContextProvider>
      </AuthContextProvider>
    </NotificationContextProvider>
  </QueryClientProvider>
);
