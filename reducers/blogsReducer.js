import { create, getAll, remove as removeBlog, sendLike } from "../src/services/blogs";
import { createSlice, createSelector } from "@reduxjs/toolkit";
import { notify } from "./notificationReducer";

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
    like(state, action) {
      return state.map((blog) => blog._id === action.payload._id ? action.payload : blog);
    },
  },
});

export const { setBlogs, add, remove, like } = blogsSlice.actions;

export default blogsSlice.reducer;

export const selectSortedBlogs = createSelector(
  state => state.blogs,
  blogs => [...blogs].sort((a, b) => b.likes - a.likes)
);

export const initializeBlogs = () => async dispatch => {
  try {
    const blogs = await getAll();
    dispatch(setBlogs(blogs));
  } catch (err) {
    dispatch(notify(err.response?.data?.error || 'Failed to Get Blogs'));
  }
};

export const newBlog = blog => async dispatch => {
  try {
    const newBlog = await create(blog);
    dispatch(add(newBlog));
  } catch (err) {
    dispatch(notify(err.response?.data?.error || 'Failed to Create Blog'));
  }
};

export const deleteBlog = blogId => async dispatch => {
  try {
    await removeBlog(blogId);
    dispatch(remove(blogId));
  } catch (err) {
    dispatch(notify(err.response?.data?.error || 'Failed to Delete Blog'));
  }
};

export const likeBlog = blog => async dispatch => {
  try {
    const likedBlog = await sendLike(blog);
    dispatch(like(likedBlog));
  } catch (err) {
    dispatch(notify(err.response?.data?.error || 'Failed to Like Blog'));
  }
};
