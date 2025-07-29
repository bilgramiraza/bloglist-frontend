import { useParams } from "react-router-dom";
import { getAll } from "../services/users";
import { useQueryWithToast } from "./Notification";

const UserSummary = () => {
  const id = useParams().id;

  const {
    isLoading: userLoadingStatus,
    data: user,
    isError: userErrorStatus,
  } = useQueryWithToast({
    queryKey: ['users'],
    queryFn: getAll,
    queryOptions: {
      select: (users) => {
        const target = users.find((user) => user.id === id);
        if (!target)
          throw new Error('User Not Found');
        return target;
      },
    },
    toastMsg: {
      loading: 'Fetching User...',
      success: 'Successfully Fetched User',
      error: (err) => err.message || 'Error Fetching User'
    },
  });

  if (userLoadingStatus) {
    return (
      <div>
        <h4>Loading Blogs</h4>
      </div>
    );
  }
  if (userErrorStatus) {
    return (
      <div>
        <h4>User Not Found</h4>
      </div>
    );
  }

  return (
    <div>
      <h4>{user?.name?.toUpperCase()} Blogs</h4>
      <ul>
        {
          user?.blogs?.length
            ? user?.blogs?.map(blog => (
              <li key={blog.id}>{blog.title}</li>
            ))
            : (
              <li>No Blogs Found</li>
            )
        }
      </ul>
    </div>
  );
};

export default UserSummary;
