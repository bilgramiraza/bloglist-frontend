import { remove as removeBlog } from '../src/services/blogs';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { api } from '../src/services/api';

const initialState = [];

const setBlogsReducer = (_state, action) => action.payload;
const addBlogsReducer = (state, action) => {
  state.push(action.payload);
};
//Replaces the Liked Blog Object
const likeBlogReducer = (state, action) =>
  state.map((blog) => (blog._id === action.payload._id ? action.payload : blog));

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: setBlogsReducer,
    add: addBlogsReducer,
    remove(state, action) {
      return state.filter((blogs) => blogs._id !== action.payload);
    },
    like: likeBlogReducer
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.getAllBlogs.matchFulfilled, setBlogsReducer)
      .addMatcher(api.endpoints.createNewBlog.matchFulfilled, addBlogsReducer)
      .addMatcher(api.endpoints.likeBlog.matchFulfilled, likeBlogReducer);
  }
});

export const { setBlogs, add, remove, like } = blogsSlice.actions;

export default blogsSlice.reducer;

export const selectBlogById = createSelector(
  [(state) => state.blogs, (_state, targetBlogId) => targetBlogId],
  (blogs, targetBlogId) => blogs.find((blog) => blog._id === targetBlogId)
);

export const deleteBlog = (blogId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    await removeBlog(blogId, token);
    dispatch(remove(blogId));
  } catch (err) {
    throw new Error(err.message || 'Failed to Delete Blog');
  }
};
