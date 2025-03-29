import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificationContextProvider } from './reducers/notificationReducer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from './reducers/authReducer';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </NotificationContextProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
