import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComment, getAll, remove, sendLike } from '../services/blogs';
import { useAuthValue } from '../reducers/authReducer';
import { useParams } from 'react-router-dom';
import { notifyError, notifySuccess } from './Notification';

const BlogSummary = () => {
  const id = useParams().id;

  const [prevError, setPrevError] = useState(null);
  const [comment, setComment] = useState('');

  const { username, token } = useAuthValue();

  const queryClient = useQueryClient();

  const {
    data: blog,
    isLoading: blogLoadingStatus,
    error: blogError,
    isError: blogErrorStatus,
  } = useQuery({
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
      notifySuccess(`Blog(${likedBlog.title}) Liked Successfully`);
    },
    onError: err => {
      notifyError(err.message || 'An Error Occured')
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
      notifySuccess(`Blog(${deletedBlog.title} By ${deletedBlog.author}) Deleted Successfully`);
    },
    onError: err => {
      notifyError(err.message || 'An Error Occured');
    },
    retry: false,
  });

  const newCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: updatedBlog => {
      const blogs = queryClient.getQueryData(['blogList']);
      queryClient.setQueryData(
        ['blogList'],
        blogs.map(blog => blog._id === updatedBlog._id ? updatedBlog : blog)
      );
      notifySuccess(`Successfully Commented on Blog(${updatedBlog.title})`);
    },
    onError: err => {
      notifyError(err.message || 'An Error Occured');
    },
    retry: false,
  });


  useEffect(() => {
    if (blogErrorStatus && blogError?.message !== prevError) {
      notifyError(blogError.message || 'An Error Occured');
      setPrevError(blogError.message);
    }
  }, [blogErrorStatus, blogError?.message, prevError]);

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
