import { createContext, useReducer, useContext } from 'react';
import { login } from '../services/login';
import { STATUS } from '../utils/constants';

const initialState = {
  status: {
    login: STATUS.INITIAL,
    restore: STATUS.INITIAL,
    logout: STATUS.INITIAL,
  },
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
        status: {
          ...state.status,
          login: STATUS.LOADING,
        },
      };
    case 'login_success':
      return {
        ...state,
        status: {
          ...state.status,
          login: STATUS.SUCCEEDED,
        },
        credentials: {
          name: action.payload.name,
          username: action.payload.username,
          token: `Bearer ${action.payload.token}`,
        }
      };
    case 'login_failed':
      return {
        ...state,
        status: {
          ...state.status,
          login: STATUS.FAILED,
        },
        error: action.payload || action.error.message,
      };
    case 'restore_start':
      return {
        ...state,
        status: {
          ...state.status,
          restore: STATUS.LOADING,
        },
      };
    case 'restore_success':
      return {
        ...state,
        status: {
          ...state.status,
          restore: STATUS.SUCCEEDED,
        },
        credentials: {
          name: action.payload.name,
          username: action.payload.username,
          token: `Bearer ${action.payload.token}`,
        }
      };
    case 'restore_failed':
      return {
        ...state,
        status: {
          ...state.status,
          restore: STATUS.FAILED,
        },
        error: action.payload || action.error.message,
      };
    case 'logout_start':
      return {
        ...state,
        status: {
          ...state.status,
          logout: STATUS.LOADING,
        },
      };
    case 'logout_success':
      return {
        ...initialState,
        status: {
          ...state.status,
          logout: STATUS.SUCCEEDED,
        },
      };
    case 'logout_failed':
      return {
        ...state,
        status: {
          ...state.status,
          logout: STATUS.FAILED,
        },
      };
    case 'resetLoginStatus':
      return {
        ...state,
        status: {
          ...state.status,
          login: STATUS.IDLE,
        },
        error: null,
      };
    case 'resetLogoutStatus':
      return {
        ...state,
        status: {
          ...state.status,
          logout: STATUS.IDLE,
        },
        error: null,
      };
    case 'resetRestoreStatus':
      return {
        ...state,
        status: {
          ...state.status,
          restore: STATUS.IDLE,
        },
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
    loginSuccess(dispatch, credentials);
    window.localStorage.setItem('loggedInBlogUser', JSON.stringify(credentials));
  } catch (err) {
    loginFailed(dispatch, err.message || 'Failed to Login User');
  }
};

export const restoreUser = async (dispatch) => {
  restoreStart(dispatch);
  try {
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogUser');
    if (!loggedUserJSON) throw new Error('Unable to Restore User');
    const credentials = JSON.parse(loggedUserJSON);
    restoreSuccess(dispatch, credentials);
  } catch (err) {
    restoreFailed(dispatch, err.message || 'Failed to Login User');
  }
};

export const logoutUser = async (dispatch) => {
  logoutStart(dispatch);
  try {
    window.localStorage.removeItem('loggedInBlogUser');
    logoutSuccess(dispatch);
  } catch (err) {
    logoutFailed(dispatch, err.message || 'Failed to Login User');
  }
};

export const loginStart = (dispatch) => {
  dispatch({
    type: 'login_start',
  });
};

export const loginSuccess = (dispatch, credentials) => {
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

export const restoreStart = (dispatch) => {
  dispatch({
    type: 'restore_start',
  });
};

export const restoreSuccess = (dispatch, credentials) => {
  dispatch({
    type: 'restore_success',
    payload: credentials,
  });
};

export const restoreFailed = (dispatch, msg) => {
  dispatch({
    type: 'restore_failed',
    payload: msg,
  });
};

export const logoutStart = (dispatch) => {
  dispatch({
    type: 'logout_start',
  });
};

export const logoutSuccess = (dispatch) => {
  dispatch({
    type: 'logout_success',
  });
};

export const logoutFailed = (dispatch, msg) => {
  dispatch({
    type: 'logout_failed',
    payload: msg,
  });
};

export const resetLoginStatus = dispatch => {
  dispatch({
    type: 'resetLoginStatus',
  });
};

export const resetRestoreStatus = dispatch => {
  dispatch({
    type: 'resetRestoreStatus',
  });
};

export const resetLogoutStatus = dispatch => {
  dispatch({
    type: 'resetLogoutStatus',
  });
};

export default AuthContext;
