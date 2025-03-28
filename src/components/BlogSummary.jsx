import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notify, useNotificationDispatch } from '../reducers/notificationReducer';
import { getAll, remove, sendLike } from '../services/blogs';
import { useAuthValue } from '../reducers/authReducer';
import { useParams } from 'react-router-dom';

const BlogSummary = () => {
  const id = useParams().id;

  const [prevError, setPrevError] = useState(null);

  const { username, token } = useAuthValue();

  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const { data: blog, error: blogError, isError: blogErrorStatus } = useQuery({
    queryKey: ['blogList'],
    queryFn: getAll,
    select: (blogs) => {
      const target = blogs.find((blog) => blog._id === id);
      if (!target)
        throw new Error('blog Not Found');
      return target;
    },
    retry: false,
    staleTime: 60 * 1000,
  });

  const likeBlogMutation = useMutation({
    mutationFn: sendLike,
    onSuccess: likedBlog => {
      const blogs = queryClient.getQueryData(['blogList']);
      queryClient.setQueryData(
        ['blogList'],
        blogs.map(blog => blog._id === likedBlog._id ? likedBlog : blog)
      );
      notify(dispatch, `Blog(${likedBlog.title}) Liked Successfully`);
    },
    onError: err => {
      notify(dispatch, err.message || 'An Error Occured', false, 5);
    },
    retry: false,
  });

  const deleteBlogMutation = useMutation({
    mutationFn: remove,
    onSuccess: deletedBlog => {
      const blogs = queryClient.getQueryData(['blogList']);
      queryClient.setQueryData(
        ['blogList'],
        blogs.filter((blog) => blog._id !== deletedBlog._id)
      );
      notify(dispatch, `Blog(${deletedBlog.title} By ${deletedBlog.author}) Deleted Successfully`);
    },
    onError: err => {
      notify(dispatch, err.message || 'An Error Occured', false, 5);
    },
    retry: false,
  });

  useEffect(() => {
    if (blogErrorStatus && blogError?.message !== prevError) {
      notify(dispatch, blogError.message || 'An Error Occured', false, 5);
      setPrevError(blogError.message);
    }
  }, [dispatch, blogErrorStatus, blogError?.message, prevError]);

  const handleLikeClick = () => {
    likeBlogMutation.mutate({ token, blog });
  };

  const handleDeleteClick = () => {
    const deleteConfirm = window.confirm(`Delete ${blog?.title} By ${blog?.author}?`);
    if (!deleteConfirm) return;

    deleteBlogMutation.mutate({ token, blog });
  };

  const blogStyle = {
    width: '15%',
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 2
  };

  const blogHeaderStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  };
  const deleteButtonStyle = {
    display: blog?.user.username === username ? '' : 'none'
  };

  return (
    <div style={blogStyle}>
      <div style={blogHeaderStyle}>
        <h4>{blog?.title}</h4>
        <p>{`-${blog?.author}`}</p>
      </div>
      <div>
        <p data-testid="blogUrl">{blog?.url}</p>
        <button data-testid="blogLike" onClick={handleLikeClick}>
          {blog?.likes}
        </button>
        <p data-testid="blogUser">{blog?.user.username}</p>
        <button data-testid="blogDelete" style={deleteButtonStyle} onClick={handleDeleteClick}>
          delete
        </button>
      </div>
    </div>
  );
};

export default BlogSummary;
