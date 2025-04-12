import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set('authorization', token);

    return headers;
  }
});

const baseQueryWithRetry = retry(
  async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if ([401, 403, 404].includes(result.error?.status)) {
      retry.fail(result.error);
    }
    return result;
  },
  { maxRetries: 3 }
);

export const api = createApi({
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Blogs', 'Users'],
  endpoints: () => ({})
});
