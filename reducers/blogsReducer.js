import { createSlice } from '@reduxjs/toolkit';
import { api } from '../src/services/api';

const initialState = [];

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.getAllBlogs.matchFulfilled, (_state, action) => {
        return action.payload;
      })
      .addMatcher(api.endpoints.createNewBlog.matchFulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addMatcher(api.endpoints.likeBlog.matchFulfilled, (state, action) => {
        //Replaces the Liked Blog Object
        return state.map((blog) => (blog._id === action.payload._id ? action.payload : blog));
      })
      .addMatcher(api.endpoints.removeBlog.matchFulfilled, (state, action) => {
        return state.filter((blogs) => blogs._id !== action.payload);
      });
  }
});

export default blogsSlice.reducer;
