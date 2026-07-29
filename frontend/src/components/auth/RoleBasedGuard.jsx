import { Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import ErrorView from '@/page-sections/permission/ErrorView';
/**
 * RoleBasedGuard - PROTECTS ROUTES BASED ON USER ROLES
 * ONLY ALLOWS ACCESS IF THE USER'S ROLE IS INCLUDED IN THE PROVIDED ROLES ARRAY
 */

export function RoleBasedGuard({
  children,
  roles
}) {
  const {
    user
  } = useAuth();
  const rawRole = user?.perfil || user?.role || '';
  const userRole = rawRole.toString().trim().toLowerCase();
  const normalizedRoles = roles.map(role => role.toString().trim().toLowerCase());
  const isAdministrator = ['administrador', 'administrator', 'admin'].includes(userRole);
  const hasRequiredRole = isAdministrator || normalizedRoles.includes(userRole);
  if (hasRequiredRole) {
    return <>{children || <Outlet />}</>;
  }
  return <ErrorView />;
}
