import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationReducer";
import blogsReducer from "./blogsReducer";
import userReducer from "./userReducer";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: userReducer,
  },
});
