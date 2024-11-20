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
