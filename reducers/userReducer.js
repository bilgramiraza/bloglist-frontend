import { createSlice } from "@reduxjs/toolkit";
import { login } from '../src/services/login';

const initialState = {
  name: null,
  username: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(_state, action) {
      return {
        name: action.payload.name,
        username: action.payload.username,
        token: `Bearer ${action.payload.token}`,
      };
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

export const loginUser = (username, password) => async dispatch => {
  try {
    const credentials = await login({ username, password });
    dispatch(setUser(credentials));
    return credentials;
  } catch (err) {
    throw new Error(err.message || 'Failed to Login User');
  }
};
