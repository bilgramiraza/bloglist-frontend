import { create, getAll, remove as removeBlog } from "../src/services/blogs";
import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = [];

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(_state, action) {
      return action.payload;
    },
    add(state, action) {
      state.push(action.payload)
    },
    remove(state, action) {
      return state.filter(blogs => blogs._id !== action.payload);
    },
  },
});

export const { setBlogs, add, remove } = blogsSlice.actions;

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

export const newBlog = blog => {
  return async dispatch => {
    const newBlog = await create(blog);
    dispatch(add(newBlog));
  };
};

export const deleteBlog = blogId => {
  return async dispatch => {
    await removeBlog(blogId);
    dispatch(remove(blogId));
  };
};
