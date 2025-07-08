import { create, createComment, getAll, remove as removeBlog, sendLike } from '../services/blogs';
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    items: [],
    status: {
      //'initial' | 'idle' | 'loading' | 'succeeded' | 'failed'
      fetch: 'initial',
      create: 'initial',
      delete: 'initial',
      like: 'initial',
      comment: 'initial'
    },
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status.fetch = 'loading';
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status.fetch = 'succeeded';
        state.items = action.payload;
        state.status.fetch = 'idle';
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status.fetch = 'failed';
        state.error = action.payload || action.error.message;
        state.status.fetch = 'idle';
      })
      .addCase(createNewBlog.pending, (state) => {
        state.status.create = 'loading';
        state.error = null;
      })
      .addCase(createNewBlog.fulfilled, (state, action) => {
        state.status.create = 'succeeded';
        state.items.push(action.payload);
        state.status.create = 'idle';
      })
      .addCase(createNewBlog.rejected, (state, action) => {
        state.status.create = 'failed';
        state.error = action.payload || action.error.message;
        state.status.create = 'idle';
      })
      .addCase(deleteBlog.pending, (state) => {
        state.status.delete = 'loading';
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.status.delete = 'succeeded';
        state.items = state.items.filter((blogs) => blogs._id !== action.payload);
        state.status.delete = 'idle';
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.status.delete = 'failed';
        state.error = action.payload || action.error.message;
        state.status.delete = 'idle';
      })
      .addCase(likeBlog.pending, (state) => {
        state.status.like = 'loading';
        state.error = null;
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        state.status.like = 'succeeded';
        state.items = state.items.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
        state.status.like = 'idle';
      })
      .addCase(likeBlog.rejected, (state, action) => {
        state.status.like = 'failed';
        state.error = action.payload || action.error.message;
        state.status.like = 'idle';
      })
      .addCase(commentOnBlog.pending, (state) => {
        state.status.comment = 'loading';
        state.error = null;
      })
      .addCase(commentOnBlog.fulfilled, (state, action) => {
        state.status.comment = 'succeeded';
        state.items = state.items.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
        state.status.comment = 'idle';
      })
      .addCase(commentOnBlog.rejected, (state, action) => {
        state.status.comment = 'failed';
        state.error = action.payload || action.error.message;
        state.status.comment = 'idle';
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
