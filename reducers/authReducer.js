import { createSlice } from '@reduxjs/toolkit';
import { api } from '../src/services/api';

const initialState = {
  name: null,
  username: null,
  token: null
};

const setUserReducer = (state, action) => {
  state.name = action.payload.name;
  state.username = action.payload.username;
  state.token = `Bearer ${action.payload.token}`;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: setUserReducer,
    logout() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, setUserReducer);
  }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
