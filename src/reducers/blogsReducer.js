import { create, createComment, getAll, remove as removeBlog, sendLike } from '../services/blogs';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    items: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  }
});

export const { add, remove, update } = blogsSlice.actions;

export default blogsSlice.reducer;

export const selectSortedBlogs = createSelector(
  (state) => state.blogs,
  ({ status, error, items }) => ({
    status,
    error,
    blogs: [...items].sort((a, b) => b.likes - a.likes)
  })
);

export const selectBlogById = createSelector(
  [(state) => state.blogs.items, (_state, targetBlogId) => targetBlogId],
  (blogs, targetBlogId) => blogs.find((blog) => blog._id === targetBlogId)
);

export const fetchBlogs = createAsyncThunk('blogs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const blogs = await getAll();
    return blogs;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to Get Blogs');
  }
});

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
