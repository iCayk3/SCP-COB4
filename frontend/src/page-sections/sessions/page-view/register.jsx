import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// CUSTOM DEFINED HOOK
import { useAuth } from '@/hooks/useAuth';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
// CUSTOM SESSIONS LAYOUT
import Layout from '../Layout';
import { FormProvider, TextField } from '@/components/form';
import { StyledDivider } from '../styles';
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().min(6, 'Password should be of minimum 6 characters length').required('Password is required')
});
export default function RegisterPageView() {
  const navigate = useNavigate();
  const {
    createUserWithEmail
  } = useAuth();
  const initialValues = {
    email: 'demo@example.com',
    password: 'password123456'
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    handleSubmit,
    formState: {
      isValid,
      isSubmitting
    }
  } = methods;
  const handleFormSubmit = handleSubmit(async values => {
    try {
      await createUserWithEmail(values.email, values.password);
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  });
  return <Layout>
      <Box maxWidth={550} p={4}>
        <Typography variant="body1" fontWeight={600} fontSize={{
        sm: 30,
        xs: 25
      }}>
          Sign up for 14 days free trial
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{
        mb: 5
      }}>
          No risk, no obligations, no credit-card required.
        </Typography>

        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="body1" sx={{
              mb: 1
            }}>
                Register with your email id
              </Typography>

              <TextField fullWidth placeholder="Enter your work email" name="email" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth placeholder="Password" type="password" name="password" />
            </Grid>

            <Grid size={12}>
              <Button fullWidth type="submit" variant="contained" disabled={!isValid} loading={isSubmitting}>
                Sign up via Email
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{
              mt: 1
            }}>
                By signing up, you agree{' '}
                <Box fontWeight={500} component={Link} href="#">
                  Terms of Service
                </Box>{' '}
                & your consent to receiving email communications from Sales handy.
              </Typography>
            </Grid>
          </Grid>
        </FormProvider>

        <StyledDivider>Already have an account?</StyledDivider>

        <Button fullWidth variant="text" onClick={() => navigate('/login')} sx={{
        backgroundColor: 'primary.50'
      }}>
          Log In
        </Button>
      </Box>
    </Layout>;
}