import { createSlice } from '@reduxjs/toolkit';
import { api } from '../src/services/api';

const initialState = {
  name: null,
  username: null,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(_state, action) {
      return {
        name: action.payload.name,
        username: action.payload.username,
        token: `Bearer ${action.payload.token}`
      };
    },
    logout() {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, setUser);
  }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
