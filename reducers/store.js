import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationReducer';
import blogsReducer from './blogsReducer';
import authReducer from './authReducer';
import usersReducer from './usersReducer';
import { api } from '../src/services/api';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    users: usersReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
});
