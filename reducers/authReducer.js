import { createSlice } from '@reduxjs/toolkit';
import { login } from '../src/services/auth';

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
    clearUser() {
      return initialState;
    }
  }
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;

export const loginUser = (username, password) => async (dispatch) => {
  try {
    const credentials = await login({ username, password });
    dispatch(setUser(credentials));
    return credentials;
  } catch (err) {
    throw new Error(err.message || 'Failed to Login User');
  }
};
