import { api } from './api';

export const blogsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: () => ({ url: '/users' }),
      providesTags: (results = []) => [
        'Users',
        ...results.map(({ _id }) => ({ type: 'Users', id: _id })),
        { type: 'Users', id: 'LIST' }
      ],
      transformErrorResponse: (res) => res?.data?.error || 'Network Issue'
    })
  })
});

export const { useGetAllUsersQuery } = blogsApi;
