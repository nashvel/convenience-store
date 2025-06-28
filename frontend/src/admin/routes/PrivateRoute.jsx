import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
