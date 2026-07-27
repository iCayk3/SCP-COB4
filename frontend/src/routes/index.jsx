import { lazy } from 'react';
import { Navigate } from 'react-router';
import { AuthRoutes } from './auth';
import { PublicRoutes } from './public';
import { DashboardRoutes } from './dashboard';
import { ComponentRoutes } from './components';

// GLOBAL ERROR PAGE
const ErrorPage = lazy(() => import('@/pages/404'));
export const routes = () => {
  return [
  // INITIAL / INDEX PAGE
  {
    path: '/',
    element: <Navigate replace to="/dashboard" />
  },
  // GLOBAL ERROR PAGE
  {
    path: '*',
    element: <ErrorPage />
  },
  // AUTHENTICATION PAGES ROUTES & DIFFERENT AUTH DEMO PAGES ROUTES
  ...AuthRoutes,
  // COMPONENTS PAGES ROUTES
  ...ComponentRoutes,
  // INSIDE DASHBOARD PAGES ROUTES
  ...DashboardRoutes,
  // PAGES ROUTES
  ...PublicRoutes];
};
