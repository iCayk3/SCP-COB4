import { use, useState } from 'react';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { FormProvider, TextField } from '@/components/form';
// CUSTOM SESSIONS LAYOUT
import Layout from '@/page-sections/sessions/Layout';
// JWT CONTEXT FILE
import { AuthContext } from '@/contexts/jwtContext';
const validationSchema = Yup.object().shape({
  name: Yup.string().max(100).required('Name is required'),
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().min(6, 'Password should be of minimum 6 characters length').required('Password is required'),
  confirmPassword: Yup.string().required('Please re-type your password').oneOf([Yup.ref('password')], 'Passwords does not match')
});
export default function RegisterView() {
  const navigate = useNavigate();
  const {
    register
  } = use(AuthContext);
  const [error, setError] = useState(null);
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: true
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = methods;
  const handleFormSubmit = handleSubmit(async values => {
    try {
      await register(values.name, values.email, values.password);
      setError(null);
    } catch (error) {
      console.log('register error -> ', error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    }
  });
  return <Layout>
      <Box maxWidth={550} p={4}>
        <Typography variant="body1" fontWeight={600} lineHeight={1} fontSize={{
        sm: 30,
        xs: 25
      }}>
          Sign up for 14 days free trial
        </Typography>

        <Typography variant="body2" sx={{
        mt: 1,
        mb: 6,
        color: 'text.secondary'
      }}>
          No risk, no obligations, no credit-card required.
        </Typography>

        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              {error && <Alert severity="error" sx={{
              mb: 3
            }}>
                  {error}
                </Alert>}

              <Typography variant="body1" fontWeight={500} sx={{
              mb: 2
            }}>
                Register with your email id
              </Typography>

              <TextField fullWidth placeholder="Enter your name" name="name" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth placeholder="Enter your work email" name="email" type="email" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth type="password" placeholder="Enter your password" name="password" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth type="password" placeholder="Confirm your password" name="confirmPassword" />
            </Grid>

            <Grid size={12}>
              <Button loading={isSubmitting} type="submit" variant="contained" fullWidth>
                Sign up via Email
              </Button>

              <Typography variant="body2" sx={{
              mt: 1,
              color: 'text.secondary'
            }}>
                By signing up, you agree <Link href="#">Terms of Service</Link> & your consent to
                receiving email communications from Sales handy.
              </Typography>
            </Grid>
          </Grid>
        </FormProvider>

        <Divider sx={{
        my: 4
      }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?
          </Typography>
        </Divider>

        <Button fullWidth variant="text" onClick={() => navigate('/jwt/login')} sx={{
        backgroundColor: 'primary.50'
      }}>
          Log In
        </Button>
      </Box>
    </Layout>;
}