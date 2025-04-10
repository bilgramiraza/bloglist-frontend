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
    })
  })
});

export const { useGetAllBlogsQuery } = blogsApi;

const create = async (newBlog, token) => {
  try {
    const config = {
      headers: {
        Authorization: token
      }
    };
    const response = await axios.post(baseUrl, newBlog, config);
    return response.data;
  } catch (err) {
    throw new Error(err?.response?.data?.error || 'Network Issue');
  }
};

const sendLike = async (blog, token) => {
  try {
    const config = {
      headers: {
        Authorization: token
      }
    };
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1
    };
    const response = await axios.put(`${baseUrl}/${blog._id}/like`, likedBlog, config);
    return response.data;
  } catch (err) {
    throw new Error(err?.response?.data?.error || 'Network Issue');
  }
};

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

export { create, sendLike, remove };
