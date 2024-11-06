import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  status: false,
};

const notifySlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
});

export const { } = notifySlice.actions;

export default notifySlice.reducer;
