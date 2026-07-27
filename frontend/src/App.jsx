import { createBrowserRouter, RouterProvider } from 'react-router';
import { ProgressProvider } from '@bprogress/react';
// MUI
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// AUTH CONTEXT FILE
import { AuthProvider } from '@/contexts/firebaseContext';
// RIGHT-TO-LEFT SUPPORT COMPONENT
import { RTL } from '@/components/rtl';
// ROUTES METHOD
import { routes } from './routes';
// MUI THEME CREATION METHOD
import { createCustomTheme } from './theme';
// SITE SETTINGS CUSTOM DEFINED HOOK
import { useSettings } from '@/hooks/useSettings';
// I18N FILE
import './i18n';
export default function App() {
  // SITE SETTINGS CUSTOM DEFINED HOOK
  const {
    settings
  } = useSettings();

  // MUI THEME CREATION
  const theme = createCustomTheme(settings);

  // ROUTER CREATE
  const router = createBrowserRouter(routes());
  return <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <RTL>
            <ProgressProvider options={{
            showSpinner: false
          }}>
              <CssBaseline />
              <RouterProvider router={router} />
            </ProgressProvider>
          </RTL>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>;
}