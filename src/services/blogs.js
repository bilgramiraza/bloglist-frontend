import { api } from './api';

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
    }),
    createNewBlog: build.mutation({
      query: (newBlog) => ({
        url: '/blogs',
        method: 'POST',
        body: newBlog
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: createdBlog } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData('getAllBlogs', undefined, (draft) => {
              draft.push(createdBlog);
              draft.sort((a, b) => b.likes - a.likes);
            })
          );
        } catch {}
      },
      transformErrorResponse: (res) => res?.data?.error || 'Network Issue'
    }),
    likeBlog: build.mutation({
      query: (blog) => ({
        url: `/blogs/${blog._id}/like`,
        method: 'PUT',
        body: { ...blog, likes: blog.likes + 1 }
      }),
      async onQueryStarted(likedBlog, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getAllBlogs', undefined, (draft) => {
            const targetBlog = draft.find((blog) => blog._id === likedBlog._id);
            if (targetBlog) targetBlog.likes++;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      transformErrorResponse: (res) => res?.data?.error || 'Network Issue'
    }),
    removeBlog: build.mutation({
      query: (blogId) => ({
        url: `/blogs/${blogId}`,
        method: 'DELETE'
      }),
      async onQueryStarted(blogId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            api.util.updateQueryData('getAllBlogs', undefined, (draft) => {
              const idx = draft.findIndex((blog) => blog._id === blogId);
              if (idx !== -1) draft.splice(idx, 1);
            })
          );
        } catch {}
      },
      transformErrorResponse: (res) => res?.data?.error || 'Network Issue'
    })
  })
});

export const {
  useGetAllBlogsQuery,
  useCreateNewBlogMutation,
  useLikeBlogMutation,
  useRemoveBlogMutation
} = blogsApi;
