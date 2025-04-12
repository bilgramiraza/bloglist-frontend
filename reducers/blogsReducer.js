import { remove as removeBlog, sendLike } from '../src/services/blogs';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { api } from '../src/services/api';

const initialState = [];

const setBlogsReducer = (_state, action) => action.payload;
const addBlogsReducer = (state, action) => {
  state.push(action.payload);
};

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: setBlogsReducer,
    add: addBlogsReducer,
    remove(state, action) {
      return state.filter((blogs) => blogs._id !== action.payload);
    },
    //Replaces the Liked Blog Object
    like(state, action) {
      return state.map((blog) => (blog._id === action.payload._id ? action.payload : blog));
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.getAllBlogs.matchFulfilled, setBlogsReducer)
      .addMatcher(api.endpoints.createNewBlog.matchFulfilled, addBlogsReducer);
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

export const likeBlog = (blog) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const likedBlog = await sendLike(blog, token);
    dispatch(like(likedBlog));
  } catch (err) {
    throw new Error(err.message || 'Failed to Like Blog');
  }
};
