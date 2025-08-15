// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { userRole } = useContext(AuthContext);
  const location = useLocation();

  // Not logged in / role not set yet -> send to login with redirect back
  //Not logged in (includes 'guest') -> send to login with redirect back
  if (!userRole || userRole === 'guest') {
    const intended = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login`} replace />;
  }

  // Logged in but role not allowed -> send somewhere safe
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
