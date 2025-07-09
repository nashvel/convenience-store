import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedUser !== 'undefined' && storedToken) {
        const userDetails = JSON.parse(storedUser);
        setUser({ ...userDetails, token: storedToken });
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    if (userData && userData.token) {
      const userDetails = { ...userData };
      delete userDetails.token;

      localStorage.setItem('user', JSON.stringify(userDetails));
      localStorage.setItem('token', userData.token);
      setUser({ ...userDetails, token: userData.token });
    } else {
      console.error('Login failed: userData or token is missing.', userData);
      logout();
    }
  };

  const updateUser = (newUserDetails) => {
    if (user && user.token) {
      const updatedUser = { ...user, ...newUserDetails, token: user.token };
      const userDetailsToStore = { ...user, ...newUserDetails };
      delete userDetailsToStore.token;

      localStorage.setItem('user', JSON.stringify(userDetailsToStore));
      setUser(updatedUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
