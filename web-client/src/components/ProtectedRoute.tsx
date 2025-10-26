import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  // While checking authentication status, show nothing
  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    // Save the attempted URL to redirect back after sign in
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
