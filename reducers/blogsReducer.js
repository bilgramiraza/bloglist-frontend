import { create, getAll, remove as removeBlog, sendLike } from "../src/services/blogs";
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
    throw new Error('Failed to Get Blogs');
  }
};

export const newBlog = blog => async (dispatch, getState) => {
  try {
    const token = getState().user.token;
    const newBlog = await create(blog, token);
    dispatch(add(newBlog));
  } catch (err) {
    throw new Error('Failed to Create Blog');
  }
};

export const deleteBlog = blogId => async (dispatch, getState) => {
  try {
    const token = getState().user.token;
    await removeBlog(blogId, token);
    dispatch(remove(blogId));
  } catch (err) {
    throw new Error('Failed to Delete Blog');
  }
};

export const likeBlog = blog => async (dispatch, getState) => {
  try {
    const token = getState().user.token;
    const likedBlog = await sendLike(blog, token);
    dispatch(like(likedBlog));
  } catch (err) {
    throw new Error('Failed to Like Blog');
  }
};
