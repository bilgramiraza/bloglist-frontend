import { getAll } from '../src/services/users';
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(_state, action) {
      return action.payload;
    }
  }
});

export const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;

export const initializeUsers = () => async (dispatch) => {
  try {
    const users = await getAll();
    dispatch(setUsers(users));
  } catch (err) {
    throw new Error(err.message || 'Failed to Get Users');
  }
};
