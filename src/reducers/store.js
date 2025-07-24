import { configureStore } from '@reduxjs/toolkit';
import blogsReducer from './blogsReducer';
import authReducer from './authReducer';
import usersReducer from './usersReducer';
import { api } from '../services/api';

export const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    users: usersReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
});
