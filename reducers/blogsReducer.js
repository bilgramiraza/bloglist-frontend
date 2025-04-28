import {
  create,
  createComment,
  getAll,
  remove as removeBlog,
  sendLike
} from '../src/services/blogs';
import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = [];

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(_state, action) {
      return action.payload;
    },
    add(state, action) {
      state.push(action.payload);
    },
    remove(state, action) {
      return state.filter((blogs) => blogs._id !== action.payload);
    },
    //Replaces the Blog Object
    update(state, action) {
      return state.map((blog) => (blog._id === action.payload._id ? action.payload : blog));
    }
  }
});

export const { setBlogs, add, remove, update } = blogsSlice.actions;

export default blogsSlice.reducer;

export const selectSortedBlogs = createSelector(
  (state) => state.blogs,
  (blogs) => [...blogs].sort((a, b) => b.likes - a.likes)
);

export const selectBlogById = createSelector(
  [(state) => state.blogs, (_state, targetBlogId) => targetBlogId],
  (blogs, targetBlogId) => blogs.find((blog) => blog._id === targetBlogId)
);

export const initializeBlogs = () => async (dispatch) => {
  try {
    const blogs = await getAll();
    dispatch(setBlogs(blogs));
  } catch (err) {
    throw new Error(err.message || 'Failed to Get Blogs');
  }
};

export const newBlog = (blog) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const newBlog = await create(blog, token);
    dispatch(add(newBlog));
  } catch (err) {
    throw new Error(err.message || 'Failed to Create Blog');
  }
};

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
    dispatch(update(likedBlog));
  } catch (err) {
    throw new Error(err.message || 'Failed to Like Blog');
  }
};

export const commentOnBlog = (blogId, comment) => async (dispatch) => {
  try {
    const commentedBlog = await createComment(blogId, comment);
    dispatch(update(commentedBlog));
  } catch (err) {
    throw new Error(err.message || 'Failed to comment on Blog');
  }
};
