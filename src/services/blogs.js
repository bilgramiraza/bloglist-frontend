import axios from 'axios';

const baseUrl = '/api/blogs';

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (err) {
    throw new Error(err?.response?.data?.error || 'Network Issue');
  }
};

const create = async ({ token, newBlog }) => {
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

const sendLike = async ({ token, blog }) => {
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

const remove = async ({ token, blog }) => {
  try {
    const config = {
      headers: {
        Authorization: token
      }
    };
    await axios.delete(`${baseUrl}/${blog._id}`, config);
    return blog;
  } catch (err) {
    throw new Error(err?.response?.data?.error || 'Network Issue');
  }
};

export { getAll, create, sendLike, remove };
