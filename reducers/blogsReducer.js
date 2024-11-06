import { getAll } from "../src/services/blogs";
import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = [];

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

export const selectSortedBlogs = createSelector(
  state => state.blogs,
  blogs => [...blogs].sort((a, b) => b.likes - a.likes)
);

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await getAll();
    dispatch(setBlogs(blogs));
  };
};
