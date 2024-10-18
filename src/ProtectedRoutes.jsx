// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if the token exists

  return token ? children : <Navigate to="/Signin" replace />;
};

export default ProtectedRoute;
