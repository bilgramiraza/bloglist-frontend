import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createComment, getAll, remove, sendLike } from '../services/blogs';
import { useAuthValue } from '../reducers/authReducer';
import { useParams } from 'react-router-dom';
import { useMutationWithToast, useQueryWithToast } from './Notification';

const BlogSummary = () => {
  const id = useParams().id;

  const [comment, setComment] = useState('');

  const { username, token } = useAuthValue();

  const queryClient = useQueryClient();

  const {
    data: blog,
    isLoading: blogLoadingStatus,
    isError: blogErrorStatus,
  } = useQueryWithToast({
    queryKey: ['blogList'],
    queryFn: getAll,
    queryOptions: {
      select: (blogs) => {
        const target = blogs.find((blog) => blog._id === id);
        if (!target)
          throw new Error('blog Not Found');
        return target;
      },
    },
    toastMsg: {
      loading: 'Fetching Blog...',
      success: (data) => `Successfully Fetched Blog(${data?.title})`,
      error: (err) => err.message || 'Error Fetching Blog'
    },
  });

  const likeBlogMutation = useMutationWithToast({
    mutationFn: sendLike,
    mutationOptions: {
      onSuccess: likedBlog => {
        const blogs = queryClient.getQueryData(['blogList']);
        queryClient.setQueryData(
          ['blogList'],
          blogs.map(blog => blog._id === likedBlog._id ? likedBlog : blog)
        );
      },
    },
    toastMsg: {
      loading: 'Liking Blog...',
      success: (data) => `Blog(${data.title}) Liked Successfully`,
      error: (err) => err.message || 'Failed to like the Blog'
    },
  });

  const deleteBlogMutation = useMutationWithToast({
    mutationFn: remove,
    mutationOptions: {
      onSuccess: deletedBlog => {
        const blogs = queryClient.getQueryData(['blogList']);
        queryClient.setQueryData(
          ['blogList'],
          blogs.filter((blog) => blog._id !== deletedBlog._id)
        );
      },
    },
    toastMsg: {
      loading: 'Deleting Blog...',
      success: (data) => `Blog(${data.title} By ${data.author}) Deleted Successfully`,
      error: (err) => err.message || 'Failed to delete the Blog'
    },
  });

  const newCommentMutation = useMutationWithToast({
    mutationFn: createComment,
    mutationOptions: {
      onSuccess: updatedBlog => {
        const blogs = queryClient.getQueryData(['blogList']);
        queryClient.setQueryData(
          ['blogList'],
          blogs.map(blog => blog._id === updatedBlog._id ? updatedBlog : blog)
        );
      },
    },
    toastMsg: {
      loading: 'Submitting Comment...',
      success: (data) => `Successfully Commented on Blog(${data.title})`,
      error: (err) => err.message || 'Failed to Comment'
    },
  });

  const handleComment = (e) => setComment(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment) return;

    newCommentMutation.mutate({ blogId: blog._id, comment });
  };

  const handleLikeClick = () => {
    likeBlogMutation.mutate({ token, blog });
  };

  const handleDeleteClick = () => {
    const deleteConfirm = window.confirm(`Delete ${blog?.title} By ${blog?.author}?`);
    if (!deleteConfirm) return;

    deleteBlogMutation.mutate({ token, blog });
  };

  const deleteButtonStyle = {
    display: blog?.user.username === username ? '' : 'none'
  };

  if (blogLoadingStatus) {
    return (
      <div>
        <p>Loading Blog</p>
      </div>
    );
  }
  if (blogErrorStatus) {
    return (
      <div>
        <p>Error Getting Blog</p>
      </div>
    );
  }

  return (
    <div>
      <h4>{blog?.title}</h4>
      <p>{`-${blog?.author}`}</p>
      <div>
        <p data-testid="blogUrl">{blog?.url}</p>
        <button data-testid="blogLike" onClick={handleLikeClick}>
          {blog?.likes}
        </button>
        <p data-testid="blogUser">{`Submitted By ${blog?.user.username}`}</p>
        <button data-testid="blogDelete" style={deleteButtonStyle} onClick={handleDeleteClick}>
          delete
        </button>
      </div>
      <div>
        <h4>Comments</h4>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='comment'
            value={comment}
            onChange={handleComment}
          />
          <button type='submit'>Post Comment</button>
        </form>
        <ul>
          {
            !blog?.comments.length
              ? <p> No Comments to Display</p>
              : blog?.comments.map(comment => <li key={comment}>{comment}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default BlogSummary;
