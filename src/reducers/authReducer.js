import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login } from '../services/auth';
import { STATUS } from '../utils/constants';

const initialState = {
  credentials: {
    name: null,
    username: null,
    token: null
  },
  status: STATUS.INITIAL,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      return {
        ...state.auth,
        credentials: {
          name: action.payload.name,
          username: action.payload.username,
          token: `Bearer ${action.payload.token}`
        }
      };
    },
    clearUser() {
      return initialState;
    },
    resetStatus(state) {
      state.status = STATUS.IDLE;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = STATUS.SUCCEEDED;
        state.credentials.name = action.payload.name;
        state.credentials.username = action.payload.username;
        state.credentials.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { setUser, clearUser, resetStatus } = authSlice.actions;

export default authSlice.reducer;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const credentials = await login({ username, password });
      return credentials;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to Login User');
    }
  }
);
