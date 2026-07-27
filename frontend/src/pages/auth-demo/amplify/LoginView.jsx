import { use, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENTS
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// CUSTOM LAYOUT COMPONENT
import Layout from '@/page-sections/sessions/Layout';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { FormProvider, TextField } from '@/components/form';
import { FlexBetween, FlexBox, FlexRowAlign } from '@/components/flexbox';
// AMPLIFY CONTEXT FILE
import { AuthContext } from '@/contexts/amplifyContext';
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().min(6, 'Password should be of minimum 6 characters length').required('Password is required'),
  remember: Yup.boolean().default(true)
});
export default function LoginView() {
  const {
    login,
    logout,
    user,
    isAuthenticated
  } = use(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const initialValues = {
    email: 'nabed420@gmail.com',
    password: '123456',
    remember: true
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    watch,
    setValue,
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = methods;
  const handleFormSubmit = handleSubmit(async values => {
    try {
      await login(values.email, values.password);
    } catch (error) {
      console.log('login error -> ', error);
    }
  });
  const INPUT_PROPS = {
    endAdornment: <FlexRowAlign onClick={() => setShowPassword(!showPassword)} sx={{
      cursor: 'pointer'
    }}>
        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </FlexRowAlign>
  };
  if (isAuthenticated && user) {
    return <Layout login>
        <Box maxWidth={550} p={4} width="100%">
          <Typography variant="body1" fontWeight={600} fontSize={{
          sm: 30,
          xs: 25
        }}>
            Welcome Back
          </Typography>

          <Typography variant="body2" sx={{
          mt: 1,
          mb: 6,
          color: 'text.secondary'
        }}>
            Hello! Mr. {user.name}
          </Typography>

          <Button fullWidth color="error" onClick={logout} variant="contained" loading={isSubmitting}>
            Logout
          </Button>
        </Box>
      </Layout>;
  }
  return <Layout login>
      <Box maxWidth={550} p={4}>
        <Typography variant="body1" fontWeight={600} fontSize={{
        sm: 30,
        xs: 25
      }}>
          Sign In
        </Typography>

        <Typography variant="body2" sx={{
        mt: 1,
        mb: 6,
        color: 'text.secondary'
      }}>
          New user?{' '}
          <Box fontWeight={500} component={Link} href="/amplify/register">
            Create an Account
          </Box>
        </Typography>

        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="body1" sx={{
              mb: 1.5,
              fontWeight: 500
            }}>
                Login with your email id
              </Typography>

              <TextField fullWidth placeholder="Enter your work email" name="email" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth name="password" placeholder="Password" type={showPassword ? 'text' : 'password'} slotProps={{
              input: INPUT_PROPS
            }} />

              <FlexBetween my={1}>
                <FlexBox alignItems="center" gap={1}>
                  <Checkbox sx={{
                  p: 0
                }} name="remember" checked={watch('remember')} onChange={e => setValue('remember', e.target.checked)} />

                  <Typography variant="body2" fontWeight={500}>
                    Remember me
                  </Typography>
                </FlexBox>

                <Box href="#" fontSize={13} component={Link} sx={{
                color: 'error.500',
                fontWeight: 500
              }}>
                  Forget Password?
                </Box>
              </FlexBetween>
            </Grid>

            <Grid size={12}>
              <Button loading={isSubmitting} type="submit" variant="contained" fullWidth>
                Sign In
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Layout>;
}