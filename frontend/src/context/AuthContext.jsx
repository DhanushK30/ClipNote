// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';
// Import the specific function we need from our new api.js file
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  const login = async (username, password) => {
    // We call the imported apiLogin function
    const userData = await apiLogin(username, password);
    if (userData && userData.access) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    // No return needed, component re-renders from setUser
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};