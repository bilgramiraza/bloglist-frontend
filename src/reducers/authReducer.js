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
    clearUser() {
      return {
        ...initialState,
        status: STATUS.IDLE
      };
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
      })
      .addCase(restoreUser.pending, (state) => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.status = STATUS.SUCCEEDED;
        state.credentials.name = action.payload.name;
        state.credentials.username = action.payload.username;
        state.credentials.token = action.payload.token;
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { clearUser, resetStatus } = authSlice.actions;

export default authSlice.reducer;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const credentials = await login({ username, password });
      window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
      return credentials;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to Login User');
    }
  }
);

export const logoutUser = () => (dispatch) => {
  dispatch(clearUser());
  window.localStorage.removeItem('loggedInBlogUser');
};

export const restoreUser = createAsyncThunk('auth/restoreUser', async (_, { rejectWithValue }) => {
  try {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (!loggedUserJSON) throw new Error('');
    const credentials = JSON.parse(loggedUserJSON);
    return credentials;
  } catch (err) {
    return rejectWithValue(err.message || 'Unable to Restore User');
  }
});
