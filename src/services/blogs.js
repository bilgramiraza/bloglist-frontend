import axios from 'axios';
import { api } from './api';

const baseUrl = '/api/blogs';

export const blogsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllBlogs: build.query({
      query: () => ({ url: '/blogs' }),
      providesTags: (results = []) => [
        'Blogs',
        ...results.map(({ _id }) => ({ type: 'Blogs', id: _id })),
        { type: 'Blogs', id: 'LIST' }
      ],
      transformResponse: (res) => res?.sort((a, b) => b.likes - a.likes),
      transformErrorResponse: (res) => res?.data?.error || 'Network Issue'
    }), //Optimize Adding New Blogs to single Call
    createNewBlog: build.mutation({
      query: (newBlog) => ({
        url: '/blogs',
        method: 'POST',
        body: newBlog
      }),
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }],
      transformErrorResponse: (res) => res?.data?.error || 'Network Issue'
    }),
    likeBlog: build.mutation({
      query: (blog) => ({
        url: `/blogs/${blog._id}/like`,
        method: 'PUT',
        body: { ...blog, likes: blog.likes + 1 }
      }),
      invalidatesTags: (likedBlog) => [{ type: 'Blogs', id: likedBlog?._id }],
      transformErrorResponse: (res) => res?.data?.error || 'Network Issue'
    })
  })
});

export const { useGetAllBlogsQuery, useCreateNewBlogMutation, useLikeBlogMutation } = blogsApi;

const remove = async (blogId, token) => {
  try {
    const config = {
      headers: {
        Authorization: token
      }
    };
    await axios.delete(`${baseUrl}/${blogId}`, config);
  } catch (err) {
    throw new Error(err?.response?.data?.error || 'Network Issue');
  }
};

export { remove };
