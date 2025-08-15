import { createContext, useReducer, useContext } from 'react';
import { login } from '../services/login';
import { STATUS } from '../utils/constants';

const initialState = {
  status: {
    login: STATUS.INITIAL,
    restore: STATUS.INITIAL,
    logout: STATUS.INITIAL,
  },
  error: {
    login: null,
    restore: null,
    logout: null,
  },
  credentials: {
    name: null,
    username: null,
    token: null,
  },
};

const setCredentials = (_, payload) => ({
  credentials: {
    name: payload.name,
    username: payload.username,
    token: `Bearer ${payload.token}`,
  },
});

const credentialsUpdater = {
  login: setCredentials,
  restore: setCredentials,
  logout: () => ({ credentials: initialState.credentials }),
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'async_start':
      return {
        ...state,
        status: { ...state.status, [action.key]: STATUS.LOADING, },
        error: { ...state.error, [action.key]: null, },
      };
    case 'async_success':
      const updater = credentialsUpdater[action.key];
      return {
        ...state,
        status: { ...state.status, [action.key]: STATUS.SUCCEEDED, },
        error: { ...state.error, [action.key]: null, },
        ...(updater ? updater(state, action.payload) : {})
      };
    case 'async_failed':
      return {
        ...state,
        status: { ...state.status, [action.key]: STATUS.FAILED, },
        error: { ...state.error, [action.key]: action.payload || action.error?.message, },
      };
    case 'async_reset':
      return {
        ...state,
        status: { ...state.status, [action.key]: STATUS.IDLE, },
        error: { ...state.error, [action.key]: null, },
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
  asyncStart(dispatch, 'login');
  try {
    const credentials = await login({ username, password });
    asyncSuccess(dispatch, 'login', credentials);
    window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
  } catch (err) {
    asyncFailed(dispatch, 'login', err.message || 'Failed to Login User');
  }
};

export const restoreUser = async (dispatch) => {
  asyncStart(dispatch, 'restore');
  try {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (!loggedUserJSON) throw new Error('Unable to Restore User');
    const credentials = JSON.parse(loggedUserJSON);
    asyncSuccess(dispatch, 'restore', credentials);
  } catch (err) {
    asyncFailed(dispatch, 'restore', err.message || 'Failed to Login User');
  }
};

export const logoutUser = async (dispatch) => {
  asyncStart(dispatch, 'logout');
  try {
    window.localStorage.removeItem('loggedInBlogUser');
    asyncSuccess(dispatch, 'logout');
  } catch (err) {
    asyncFailed(dispatch, 'logout', err.message || 'Failed to Login User');
  }
};

export const asyncStart = (dispatch, key) => {
  dispatch({
    type: 'async_start',
    key
  });
};

export const asyncSuccess = (dispatch, key, credentials = {}) => {
  dispatch({
    type: 'async_success',
    key,
    payload: credentials
  });
};

export const asyncFailed = (dispatch, key, msg) => {
  dispatch({
    type: 'async_failed',
    key,
    payload: msg,
  });
};

export const asyncReset = (dispatch, key) => {
  dispatch({
    type: 'async_reset',
    key
  });
};

export default AuthContext;
