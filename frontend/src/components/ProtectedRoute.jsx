// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// The "children" prop is for the case where this component is used as a wrapper
function ProtectedRoute({ children }) { 
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back there after they log in.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If there are children, render them (for index routes). Otherwise, render the nested routes.
  return children ? children : <Outlet />;
}

export default ProtectedRoute;