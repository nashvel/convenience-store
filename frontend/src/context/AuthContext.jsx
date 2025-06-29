import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedUser !== 'undefined' && storedToken) {
      try {
        const userDetails = JSON.parse(storedUser);
        // Combine user details and token into the initial state
        return { ...userDetails, token: storedToken };
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  const login = (userData) => {
    if (userData && userData.token) {
      // Store the user details and token separately for clarity and security
      const userDetails = { ...userData };
      delete userDetails.token; // Avoid duplicating the token inside the user object

      localStorage.setItem('user', JSON.stringify(userDetails));
      localStorage.setItem('token', userData.token);

      // Set the user state with both details and the token
      setUser({ ...userDetails, token: userData.token });
    } else {
      console.error('Login failed: userData or token is missing.', userData);
      logout(); // Ensure clean state on failed login
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
