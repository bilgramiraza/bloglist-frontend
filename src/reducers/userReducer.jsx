import { createContext, useContext, useReducer } from "react";

const initalState = [];

const userReducer = (state, action) => {
  switch (action.type) {
    case 'setUsers':
      return action.payload;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = props => {
  const [users, dispatch] = useReducer(userReducer, initalState);
  return (
    <UserContext.Provider value={[users, dispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUsersValue = () => {
  const usersAndDispatch = useContext(UserContext);
  return usersAndDispatch[0];
};

export const useUsersDispatch = () => {
  const usersAndDispatch = useContext(UserContext);
  return usersAndDispatch[1];
};

export default UserContext;
