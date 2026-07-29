import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

/**
 * AuthGuard - PROTECTS ROUTES THAT REQUIRE AUTHENTICATION
 * REDIRECTS UNAUTHENTICATED USERS TO THE LOGIN PAGE WITH THE CURRENT PATH SAVED
 */

export function AuthGuard({
  children
}) {
  const {
    pathname
  } = useLocation();
  const {
    isAuthenticated,
    user
  } = useAuth();
  if (isAuthenticated && user?.trocaSenhaObrigatoria && pathname !== '/trocar-senha') {
    return <Navigate replace to="/trocar-senha" />;
  }
  if (isAuthenticated) return <>{children}</>;
  return <Navigate replace to="/login" state={{
    from: pathname
  }} />;
}
