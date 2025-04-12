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

const removeBlogReducer = (state, action) => state.filter((blogs) => blogs._id !== action.payload);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: setBlogsReducer,
    add: addBlogsReducer,
    remove: removeBlogReducer,
    like: likeBlogReducer
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.getAllBlogs.matchFulfilled, setBlogsReducer)
      .addMatcher(api.endpoints.createNewBlog.matchFulfilled, addBlogsReducer)
      .addMatcher(api.endpoints.likeBlog.matchFulfilled, likeBlogReducer)
      .addMatcher(api.endpoints.removeBlog.matchFulfilled, removeBlogReducer);
  }
});

export const { setBlogs, add, remove, like } = blogsSlice.actions;

export default blogsSlice.reducer;

export const selectBlogById = createSelector(
  [(state) => state.blogs, (_state, targetBlogId) => targetBlogId],
  (blogs, targetBlogId) => blogs.find((blog) => blog._id === targetBlogId)
);
