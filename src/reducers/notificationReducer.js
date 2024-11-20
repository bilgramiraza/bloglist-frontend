import { createContext, useReducer, useContext } from 'react';

const initialState = {
  message: null,
  status: false
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'notify':
      return {
        message: action.payload.message,
        status: action.payload.status
      };
    case 'clear':
      return initialState;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, initialState);

  <NotificationContext.Provider value={[notification, dispatch]}>
    {props.children}
  </NotificationContext.Provider>;
};

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};
