import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  status: false,
};

const notifySlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotify(_state, action) {
      return {
        message: action.payload.message,
        status: action.payload.status,
      };
    },
    clearNotify() {
      return initialState;
    },
  },
});

export const { setNotify, clearNotify } = notifySlice.actions;

export default notifySlice.reducer;
