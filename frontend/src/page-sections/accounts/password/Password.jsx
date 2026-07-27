import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { FormProvider, TextField } from '@/components/form';
// STYLED COMPONENT
import { FormWrapper, Dot } from './styles';
export default function Password() {
  const initialValues = {
    newPassword: '123456',
    currentPassword: '123456',
    confirmNewPassword: '123456'
  };
  const validationSchema = Yup.object({
    currentPassword: Yup.string().min(3, 'Must be greater then 3 characters').required('Current Password is Required!'),
    newPassword: Yup.string().min(8).required('New Password is Required!'),
    confirmNewPassword: Yup.string().test('password-should-match', 'Passwords must match', function (value) {
      return this.parent.newPassword === value;
    }).required('Confirm Password is Required!')
  });
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

  // FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2));
  });
  return <Card>
      <Typography variant="body1" fontWeight={500} className="p-3">
        Change Your Password
      </Typography>

      <Divider />

      <FormWrapper>
        <Grid container spacing={5}>
          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <FormProvider methods={methods} onSubmit={handleSubmitForm}>
              <Stack spacing={4}>
                <TextField fullWidth type="password" variant="outlined" name="currentPassword" label="Current Password" />

                <TextField fullWidth type="password" name="newPassword" variant="outlined" label="New Password" />

                <TextField fullWidth type="password" variant="outlined" name="confirmNewPassword" label="Confirm Password" />
              </Stack>

              <Stack direction="row" spacing={2} mt={4}>
                <Button loading={isSubmitting} type="submit" variant="contained">
                  Save Changes
                </Button>

                <Button variant="outlined">Cancel</Button>
              </Stack>
            </FormProvider>
          </Grid>

          <Grid size={12}>
            <Typography variant="body2" fontWeight={500}>
              Password requirements:
            </Typography>

            <Typography variant="body2" color="grey.500">
              Ensure that these requirements are met:
            </Typography>

            <Stack spacing={1} mt={2}>
              {REQUIREMENTS.map(item => <FlexBox alignItems="center" gap={1} key={item}>
                  <Dot />

                  <Typography variant="body2" fontSize={13}>
                    {item}
                  </Typography>
                </FlexBox>)}
            </Stack>
          </Grid>
        </Grid>
      </FormWrapper>
    </Card>;
}
const REQUIREMENTS = ['Minimum 8 characters long - the more, the better', 'At least one lowercase character', 'At least one uppercase character', 'At least one number, symbol, or whitespace character'];