import { create, createComment, getAll, remove as removeBlog, sendLike } from '../services/blogs';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUS } from '../utils/constants';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    items: [],
    status: {
      fetch: STATUS.INITIAL,
      create: STATUS.INITIAL,
      delete: STATUS.INITIAL,
      like: STATUS.INITIAL,
      comment: STATUS.INITIAL
    },
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status.fetch = STATUS.LOADING;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status.fetch = STATUS.SUCCEEDED;
        state.items = action.payload;
        state.status.fetch = STATUS.IDLE;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status.fetch = STATUS.FAILED;
        state.error = action.payload || action.error.message;
        state.status.fetch = STATUS.IDLE;
      })
      .addCase(createNewBlog.pending, (state) => {
        state.status.create = STATUS.LOADING;
        state.error = null;
      })
      .addCase(createNewBlog.fulfilled, (state, action) => {
        state.status.create = STATUS.SUCCEEDED;
        state.items.push(action.payload);
        state.status.create = STATUS.IDLE;
      })
      .addCase(createNewBlog.rejected, (state, action) => {
        state.status.create = STATUS.FAILED;
        state.error = action.payload || action.error.message;
        state.status.create = STATUS.IDLE;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.status.delete = STATUS.LOADING;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.status.delete = STATUS.SUCCEEDED;
        state.items = state.items.filter((blogs) => blogs._id !== action.payload);
        state.status.delete = STATUS.IDLE;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.status.delete = STATUS.FAILED;
        state.error = action.payload || action.error.message;
        state.status.delete = STATUS.IDLE;
      })
      .addCase(likeBlog.pending, (state) => {
        state.status.like = STATUS.LOADING;
        state.error = null;
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        state.status.like = STATUS.SUCCEEDED;
        state.items = state.items.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
        state.status.like = STATUS.IDLE;
      })
      .addCase(likeBlog.rejected, (state, action) => {
        state.status.like = STATUS.FAILED;
        state.error = action.payload || action.error.message;
        state.status.like = STATUS.IDLE;
      })
      .addCase(commentOnBlog.pending, (state) => {
        state.status.comment = STATUS.LOADING;
        state.error = null;
      })
      .addCase(commentOnBlog.fulfilled, (state, action) => {
        state.status.comment = STATUS.SUCCEEDED;
        state.items = state.items.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
        state.status.comment = STATUS.IDLE;
      })
      .addCase(commentOnBlog.rejected, (state, action) => {
        state.status.comment = STATUS.FAILED;
        state.error = action.payload || action.error.message;
        state.status.comment = STATUS.IDLE;
      });
  }
});

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
  [(state) => state.blogs, (_state, targetBlogId) => targetBlogId],
  ({ status, error, items }, targetBlogId) => ({
    status,
    error,
    blog: [...items].find((blog) => blog._id === targetBlogId)
  })
);

export const fetchBlogs = createAsyncThunk('blogs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const blogs = await getAll();
    return blogs;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to Get Blogs');
  }
});

export const createNewBlog = createAsyncThunk(
  'blogs/createNewBlog',
  async (blog, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const newBlog = await create(blog, token);
      return newBlog;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to Create Blog');
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (blogId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await removeBlog(blogId, token);
      return blogId;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to Delete Blog');
    }
  }
);

export const likeBlog = createAsyncThunk(
  'blogs/likeBlog',
  async (blog, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const likedBlog = await sendLike(blog, token);
      return likedBlog;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to Like Blog');
    }
  }
);

export const commentOnBlog = createAsyncThunk(
  'blogs/commentOnBlog',
  async ({ blogId, comment }, { rejectWithValue }) => {
    try {
      const commentedBlog = await createComment(blogId, comment);
      return commentedBlog;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to Like Blog');
    }
  }
);
