import { lazy } from 'react';
import { Navigate } from 'react-router';
import { GuestGuard } from '@/components/auth';

// AUTHENTICATION RELATED PAGES
const Login = lazy(() => import('@/pages/sessions/login'));
const ChangePassword = lazy(() => import('@/pages/sessions/change-password'));
export const AuthRoutes = [
{
  path: 'trocar-senha',
  element: <ChangePassword />
},
// AUTHENTICATION PAGES ROUTES
{
  element: <GuestGuard />,
  children: [{
    path: 'login',
    element: <Login />
  }, {
    path: 'register',
    element: <Navigate replace to="/login" />
  }, {
    path: 'forget-password',
    element: <Navigate replace to="/login" />
  }, {
    path: 'verify-code',
    element: <Navigate replace to="/login" />
  }]
}];
