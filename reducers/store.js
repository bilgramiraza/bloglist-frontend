import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationReducer";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});
