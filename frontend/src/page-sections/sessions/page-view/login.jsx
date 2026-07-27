import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// CUSTOM DEFINED HOOK
import { useAuth } from '@/hooks/useAuth';
// CUSTOM LAYOUT COMPONENT
import Layout from '../Layout';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { FlexBetween, FlexBox } from '@/components/flexbox';
import { FormProvider, TextField } from '@/components/form';
// CUSTOM ICON COMPONENTS
import GoogleIcon from '@/icons/GoogleIcon';
import Twitter from '@/icons/social/Twitter';
import Facebook from '@/icons/social/Facebook';
// STYLED COMPONENTS
import { SocialButton, StyledDivider } from '../styles';
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().min(6, 'Password should be of minimum 6 characters length').required('Password is required'),
  remember: Yup.boolean().default(true)
});
export default function LoginPageView() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    signInWithEmail,
    signInWithGoogle
  } = useAuth();
  const handleGoogle = async () => {
    await signInWithGoogle();
  };
  const initialValues = {
    email: 'jason@ui-lib.com',
    password: 'dummyPass',
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
      isSubmitting,
      isValid
    }
  } = methods;
  const handleFormSubmit = handleSubmit(async values => {
    try {
      await signInWithEmail(values.email, values.password);
    } catch (error) {
      console.log(error);
    }
  });
  return <Layout login>
      <Box maxWidth={550} p={4}>
        <Typography variant="h4" fontWeight={600} fontSize={{
        sm: 30,
        xs: 25
      }}>
          Sign In
        </Typography>

        <Typography variant="body2" fontWeight={500} mt={1} mb={6} color="text.secondary">
          New user?{' '}
          <Box fontWeight={500} component={Link} href="/register">
            Create an Account
          </Box>
        </Typography>

        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="body1" fontSize={16} mb={1.5}>
                Login with your email id
              </Typography>

              <TextField fullWidth name="email" placeholder="Enter your work email" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth placeholder="Password" type={showPassword ? 'text' : 'password'} name="password" slotProps={{
              input: {
                endAdornment: <ButtonBase disableRipple disableTouchRipple onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </ButtonBase>
              }
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

                <Box fontSize={13} component={Link} fontWeight={500} color="error.500" href="/forget-password">
                  Forget Password?
                </Box>
              </FlexBetween>
            </Grid>

            <Grid size={12}>
              <Button fullWidth type="submit" variant="contained" disabled={!isValid} loading={isSubmitting}>
                Sign In
              </Button>
            </Grid>
          </Grid>
        </FormProvider>

        <StyledDivider>OR</StyledDivider>

        <FlexBox justifyContent="center" flexWrap="wrap" gap={2}>
          <SocialButton onClick={handleGoogle}>
            <GoogleIcon className="icon" />
          </SocialButton>

          <SocialButton>
            <Facebook className="icon facebook" />
          </SocialButton>

          <SocialButton>
            <Twitter className="icon twitter" />
          </SocialButton>
        </FlexBox>
      </Box>
    </Layout>;
}