import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

/**
 * GuestGuard - PREVENTS AUTHENTICATED USERS FROM ACCESSING GUEST-ONLY ROUTES
 * REDIRECTS AUTHENTICATED USERS TO THEIR PREVIOUS LOCATION OR /DASHBOARD
 */

export function GuestGuard({
  children
}) {
  const {
    state
  } = useLocation();
  const {
    isAuthenticated
  } = useAuth();
  const locationState = state;
  const redirectPath = locationState?.from || '/dashboard';
  if (isAuthenticated) {
    return <Navigate replace to={redirectPath} />;
  }
  return children || <Outlet />;
}