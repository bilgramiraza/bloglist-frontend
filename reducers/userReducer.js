import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  username: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

  },
});

export const { } = userSlice.actions;

export default userSlice.reducer;
