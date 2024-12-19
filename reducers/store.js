import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationReducer';
import blogsReducer from './blogsReducer';
import authReducer from './authReducer';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    auth: authReducer
  }
});
