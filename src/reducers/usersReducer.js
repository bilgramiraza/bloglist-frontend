import { getAll } from '../services/users';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../utils/constants';

const initialState = {
  items: [],
  status: {
    fetch: STATUS.INITIAL
  },
  error: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetStatus(state, action) {
      state.status[action.payload] = STATUS.IDLE;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status.fetch = STATUS.LOADING;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status.fetch = STATUS.SUCCEEDED;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status.fetch = STATUS.FAILED;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { resetStatus } = usersSlice.actions;

export default usersSlice.reducer;

export const selectUserById = createSelector(
  [(state) => state.users, (_state, userId) => userId],
  ({ status, error, items }, userId) => ({
    status,
    error,
    user: items.find((user) => user.id === userId)
  })
);

export const resetFetchStatus = () => (dispatch) => {
  dispatch(resetStatus('fetch'));
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const users = await getAll();
    return users;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to Get Users');
  }
});
