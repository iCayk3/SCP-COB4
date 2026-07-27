import { lazy } from 'react';
import { GuestGuard } from '@/components/auth';

// AUTHENTICATION RELATED PAGES
const Login = lazy(() => import('@/pages/sessions/login'));
const Register = lazy(() => import('@/pages/sessions/register'));
const VerifyCode = lazy(() => import('@/pages/sessions/verify-code'));
const ForgetPassword = lazy(() => import('@/pages/sessions/forget-password'));

// DIFFERENT AUTH DEMO PAGES
const LoginDemoWithAuth0 = lazy(() => import('@/pages/auth-demo/auth0/login'));
const LoginDemoWithJWT = lazy(() => import('@/pages/auth-demo/jwt/login'));
const RegisterDemoWithJWT = lazy(() => import('@/pages/auth-demo/jwt/register'));
const LoginDemoWithFirebase = lazy(() => import('@/pages/auth-demo/firebase/login'));
const RegisterDemoWithFirebase = lazy(() => import('@/pages/auth-demo/firebase/register'));
const LoginDemoWithAmplify = lazy(() => import('@/pages/auth-demo/amplify/login'));
const RegisterDemoWithAmplify = lazy(() => import('@/pages/auth-demo/amplify/register'));
const VerifyDemoWithAmplify = lazy(() => import('@/pages/auth-demo/amplify/verify'));
export const AuthRoutes = [
// AUTHENTICATION PAGES ROUTES
{
  element: <GuestGuard />,
  children: [{
    path: 'login',
    element: <Login />
  }, {
    path: 'register',
    element: <Register />
  }, {
    path: 'forget-password',
    element: <ForgetPassword />
  }, {
    path: 'verify-code',
    element: <VerifyCode />
  }]
},
// DIFFERENT AUTH DEMO PAGES ROUTES
{
  path: 'auth0/login',
  element: <LoginDemoWithAuth0 />
}, {
  path: 'jwt',
  children: [{
    path: 'login',
    element: <LoginDemoWithJWT />
  }, {
    path: 'register',
    element: <RegisterDemoWithJWT />
  }]
}, {
  path: 'firebase',
  children: [{
    path: 'login',
    element: <LoginDemoWithFirebase />
  }, {
    path: 'register',
    element: <RegisterDemoWithFirebase />
  }]
}, {
  path: 'amplify',
  children: [{
    path: 'login',
    element: <LoginDemoWithAmplify />
  }, {
    path: 'register',
    element: <RegisterDemoWithAmplify />
  }, {
    path: 'verify',
    element: <VerifyDemoWithAmplify />
  }]
}];