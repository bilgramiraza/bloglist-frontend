import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  status: false
};

const notifySlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotify(_state, action) {
      return {
        message: action.payload.message,
        status: action.payload.status
      };
    },
    clearNotify() {
      return initialState;
    }
  }
});

export const { setNotify, clearNotify } = notifySlice.actions;

export const notify = (message, status = true, time = 3) => {
  return async (dispatch) => {
    dispatch(setNotify({ message, status }));

    setTimeout(() => dispatch(clearNotify()), time * 1000);
  };
};

export default notifySlice.reducer;
