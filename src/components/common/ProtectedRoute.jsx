import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { currentUser } = useApp();

  if (!currentUser) {
    // Redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to unauthorized or dashboard if role is not allowed
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
