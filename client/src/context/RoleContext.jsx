import React, { createContext, useState, useContext } from 'react';

// Create the context
const RoleContext = createContext();

// RoleProvider component to provide the role context
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('instructor'); // default role is 'user'

  // Function to set role (can be called on login or role change)
  const setUserRole = (newRole) => {
    setRole(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to use role context
export const useRole = () => {
  return useContext(RoleContext);
};
export default RoleContext;