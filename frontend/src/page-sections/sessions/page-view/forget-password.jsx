import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import NavigateBefore from '@mui/icons-material/NavigateBefore';
// CUSTOM COMPONENTS
import { FlexRowAlign } from '@/components/flexbox';
import { FormProvider, TextField } from '@/components/form';
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required')
});
export default function ForgetPasswordPageView() {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      email: ''
    },
    resolver: yupResolver(schema)
  });
  const {
    handleSubmit,
    formState: {
      isSubmitting,
      isValid
    }
  } = methods;
  const handleFormSubmit = handleSubmit(data => {
    console.log(data);
  });
  return <FlexRowAlign height="100%" bgcolor="background.paper">
      <Box textAlign="center" maxWidth={500} width="100%" padding={4}>
        <img src="/static/forget-passwod.svg" alt="Logo" />

        <Typography variant="h4" sx={{
        mt: 2
      }}>
          Forgot your password?
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{
        px: 3,
        mt: 1
      }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
        </Typography>

        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Stack gap={3} mt={5}>
            <TextField name="email" fullWidth label="Email" type="email" />
            <Button type="submit" fullWidth disabled={!isValid} loading={isSubmitting}>
              Send Link
            </Button>

            <Button disableRipple variant="text" color="secondary" onClick={() => navigate('/login')}>
              <NavigateBefore fontSize="small" /> Back to Sign In
            </Button>
          </Stack>
        </FormProvider>
      </Box>
    </FlexRowAlign>;
}