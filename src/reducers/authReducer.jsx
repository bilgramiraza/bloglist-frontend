import { createContext, useReducer, useContext } from 'react';
import { login } from '../services/login';

const initialState = {
  name: null,
  username: null,
  token: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return {
        name: action.payload.name,
        username: action.payload.username,
        token: `Bearer ${action.payload.token}`,
      };
    case 'logout':
      return initialState;
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [auth, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={[auth, dispatch]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthValue = () => {
  const authAndDispatch = useContext(AuthContext);
  return authAndDispatch[0];
};

export const useAuthDispatch = () => {
  const authAndDispatch = useContext(AuthContext);
  return authAndDispatch[1];
};

export const loginUser = async (dispatch, username, password) => {
  try {
    const credentials = await login({ username, password });
    setAuth(dispatch, credentials);
    return credentials;
  } catch (err) {
    throw new Error(err.message || 'Failed to Login User');
  }
};

export const setAuth = (dispatch, credentials) => {
  dispatch({
    type: 'login',
    payload: credentials,
  });
};

export const clearAuth = dispatch => {
  dispatch({
    type: 'logout',
  });
};

export default AuthContext;
