import { createContext, useReducer, useContext } from 'react';
import { login } from '../services/login';
import { STATUS } from '../utils/constants';

const initialState = {
  status: STATUS.INITIAL,
  error: null,
  credentials: {
    name: null,
    username: null,
    token: null,
  },
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'login_start':
      return {
        ...state,
        status: STATUS.LOADING,
      };
    case 'login_success':
      return {
        ...state,
        status: STATUS.SUCCEEDED,
        credentials: {
          name: action.payload.name,
          username: action.payload.username,
          token: `Bearer ${action.payload.token}`,
        }
      };
    case 'login_failed':
      return {
        ...state,
        status: STATUS.FAILED,
        error: action.payload || action.error.message,
      };
    case 'logout':
      return initialState;
    case 'resetStatus':
      return {
        ...state,
        status: STATUS.IDLE,
        error: null,
      };
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
  loginStart(dispatch);
  try {
    const credentials = await login({ username, password });
    setAuth(dispatch, credentials);
    window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
  } catch (err) {
    loginFailed(dispatch, err.message || 'Failed to Login User');
  }
};

export const loginStart = (dispatch) => {
  dispatch({
    type: 'login_start',
  });
};

export const setAuth = (dispatch, credentials) => {
  dispatch({
    type: 'login_success',
    payload: credentials,
  });
};

export const loginFailed = (dispatch, msg) => {
  dispatch({
    type: 'login_failed',
    payload: msg,
  });
};

export const clearAuth = dispatch => {
  dispatch({
    type: 'logout',
  });
};

export const resetStatus = dispatch => {
  dispatch({
    type: 'resetStatus',
  });
};

export default AuthContext;
