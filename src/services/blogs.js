import axios from 'axios';

const baseUrl = '/api/blogs';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async ({ token, newBlog }) => {
  const config = {
    headers: {
      Authorization: token
    }
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const sendLike = async ({ token, blog }) => {
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
};

const remove = async ({ token, blog }) => {
  const config = {
    headers: {
      Authorization: token
    }
  };
  await axios.delete(`${baseUrl}/${blog._id}`, config);
  return blog;
};

export { getAll, create, sendLike, remove };
