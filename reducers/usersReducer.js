import { createSlice } from '@reduxjs/toolkit';
import { api } from '../src/services/api';

const initialState = [];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.getAllUsers.matchFulfilled, (_state, action) => {
      return action.payload;
    });
  }
});

export default usersSlice.reducer;
