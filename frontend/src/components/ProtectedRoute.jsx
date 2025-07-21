import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { userRole } = useContext(AuthContext);

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }
  console.log("ProtectedRoute check:", userRole);
  return children;
}
