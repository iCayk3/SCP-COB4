import { use } from 'react';
// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// CUSTOM LAYOUT COMPONENT
import Layout from '@/page-sections/sessions/Layout';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
// AUTH0 CONTEXT FILE
import { AuthContext } from '@/contexts/auth0Context';
export default function LoginView() {
  const {
    isAuthenticated,
    user,
    loginWithPopup,
    logout
  } = use(AuthContext);
  const handleSingIn = () => loginWithPopup();
  const handleSingOut = () => logout();
  return <Layout login>
      <Box maxWidth={550} p={4} width="100%">
        <Typography variant="body1" fontWeight={600} fontSize={{
        sm: 30,
        xs: 25
      }}>
          {isAuthenticated ? 'Welcome Back' : 'Welcome to Auth0'}
        </Typography>

        <Typography variant="body2" sx={{
        mt: 1,
        mb: 6,
        color: 'text.secondary'
      }}>
          {isAuthenticated ? <>Hello! {user?.email}</> : <>
              New user? <Link href="/register">Create an Account</Link>
            </>}
        </Typography>

        {isAuthenticated ? <Button fullWidth size="large" color="error" onClick={handleSingOut}>
            Sign Out
          </Button> : <Button fullWidth size="large" onClick={handleSingIn}>
            Sign In
          </Button>}
      </Box>
    </Layout>;
}