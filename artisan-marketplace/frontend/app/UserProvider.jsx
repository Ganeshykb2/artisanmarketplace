import { createContext, useContext } from 'react';

// Create the Context internally
const UserContext = createContext();

// Provide a default value or initialize your layout state here
export const useUser = () => useContext(UserContext);

// Set up the provider (optional if wrapping is required)
export const UserProvider = ({ children, user }) => (
  <UserContext.Provider value={{userId: user?.userId, userName: user?.userName, userEmail: user?.userEmail, userType: user?.userType}}>{children}</UserContext.Provider>
);