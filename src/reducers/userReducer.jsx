import { createContext, useReducer, useContext } from 'react';
import { login } from '../services/login';

const initialState = {
  name: null,
  username: null,
  token: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'setUser':
      return {
        name: action.payload.name,
        username: action.payload.username,
        token: `Bearer ${action.payload.token}`,
      };
    case 'clearUser':
      return initialState;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[0];
};

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[1];
};

export const loginUser = async (dispatch, username, password) => {
  try {
    const credentials = await login({ username, password });
    setUser(dispatch, credentials);
    return credentials;
  } catch (err) {
    throw new Error(err.message || 'Failed to Login User');
  }
};

export const setUser = (dispatch, credentials) => {
  dispatch({
    type: 'setUser',
    payload: credentials,
  });
};

export const clearUser = dispatch => {
  dispatch({
    type: 'clearUser',
  });
};

export default UserContext;
