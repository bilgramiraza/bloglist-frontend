import { getAll } from "../src/services/blogs";
const { createSlice } = require("@reduxjs/toolkit");

const initialState = null;

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(_state, action) {
      return action.payload;
    },
  },
});

export const { setBlogs } = blogsSlice.actions;

export default blogsSlice.reducer;

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await getAll();
    dispatch(setBlogs(blogs));
  };
};
