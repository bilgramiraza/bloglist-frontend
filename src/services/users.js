import axios from 'axios';

const baseUrl = '/api/users';

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (err) {
    throw new Error(err?.response?.data?.error || 'Network Issue');
  }
};

export { getAll };
