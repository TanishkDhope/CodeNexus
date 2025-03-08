import React, { createContext, useState, useContext } from 'react';

// Create the context
const RoleContext = createContext();

// RoleProvider component to provide the role context
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('user'); // Default role is 'instructor'

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to use role context
export const useRole = () => {
  return useContext(RoleContext);
};

export default RoleContext;
