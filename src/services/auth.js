import { api } from './api';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => {
        return {
          url: '/login',
          method: 'POST',
          body: credentials
        };
      },
      transformResponse: (res) => ({ name: res.name, username: res.username, token: res.token }),
      transformErrorResponse: (res) => res?.data?.error || 'Network Issue'
    })
  })
});

export const { useLoginMutation } = authApi;
