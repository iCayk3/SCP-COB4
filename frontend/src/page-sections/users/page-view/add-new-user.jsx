import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// MUI ICON COMPONENT
import PhotoCamera from '@mui/icons-material/PhotoCamera';
// CUSTOM COMPONENTS
import { FormProvider, TextField } from '@/components/form';

// STYLED COMPONENTS
const SwitchWrapper = styled('div')({
  width: '100%',
  marginTop: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});
const StyledCard = styled(Card)(({
  theme
}) => ({
  padding: 24,
  minHeight: 400,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  '.alert-text': {
    maxWidth: 200,
    display: 'block',
    marginTop: '1rem',
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));
const ButtonWrapper = styled('div')(({
  theme
}) => ({
  width: 100,
  height: 100,
  display: 'flex',
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  })
}));
const UploadButton = styled('div')(({
  theme
}) => ({
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[200],
  border: `1px solid ${theme.palette.background.paper}`,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[600]
  }),
  '& .icon': {
    fontSize: 26,
    color: theme.palette.grey[400]
  },
  '& input': {
    display: 'none'
  }
}));
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Name is Required!'),
  email: Yup.string().email().required('Email is Required!'),
  phone: Yup.string().min(8).required('Phone is Required!'),
  country: Yup.string().required('Country is Required!'),
  state: Yup.string().required('State is Required!'),
  city: Yup.string().required('City is Required!'),
  address: Yup.string().required('Address is Required!'),
  zip: Yup.string().required('Zip is Required!'),
  about: Yup.string().required('About is Required!')
});
export default function AddNewUserPageView() {
  const initialValues = {
    fullName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zip: '',
    about: ''
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
  const handleSubmitForm = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2));
  });
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          <StyledCard>
            <ButtonWrapper>
              <UploadButton>
                <label htmlFor="upload-btn">
                  <input accept="image/*" id="upload-btn" type="file" />
                  <IconButton component="span">
                    <PhotoCamera className="icon" />
                  </IconButton>
                </label>
              </UploadButton>
            </ButtonWrapper>

            <Typography variant="body2" fontSize={13} className="alert-text">
              Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB
            </Typography>

            <Box maxWidth={280} mt={5} mb={1}>
              <SwitchWrapper>
                <Typography variant="body2" fontWeight={500}>
                  Public Profile
                </Typography>

                <Switch defaultChecked />
              </SwitchWrapper>

              <SwitchWrapper>
                <Typography variant="body2" fontWeight={500}>
                  Banned
                </Typography>

                <Switch defaultChecked />
              </SwitchWrapper>

              <Typography variant="body2" fontSize={13} color="text.secondary">
                Apply disable account
              </Typography>

              <SwitchWrapper>
                <Typography variant="body2" fontWeight={500}>
                  Email Verified
                </Typography>

                <Switch defaultChecked />
              </SwitchWrapper>

              <Typography variant="body2" fontSize={13} color="text.secondary">
                Disabling this will automatically send the user a verification email
              </Typography>
            </Box>
          </StyledCard>
        </Grid>

        <Grid size={{
        md: 8,
        xs: 12
      }}>
          <Card className="p-3">
            <FormProvider methods={methods} onSubmit={handleSubmitForm}>
              <Grid container spacing={3}>
                <Grid size={{
                sm: 6,
                xs: 12
              }}>
                  <TextField fullWidth name="fullName" label="Full Name" />
                </Grid>

                <Grid size={{
                sm: 6,
                xs: 12
              }}>
                  <TextField fullWidth name="email" label="Email Address" />
                </Grid>

                <Grid size={{
                sm: 6,
                xs: 12
              }}>
                  <TextField fullWidth name="phone" label="Phone Number" />
                </Grid>

                <Grid size={{
                sm: 6,
                xs: 12
              }}>
                  <TextField fullWidth name="country" label="Country" />
                </Grid>

                <Grid size={{
                sm: 6,
                xs: 12
              }}>
                  <TextField fullWidth name="state" label="State/Region" />
                </Grid>

                <Grid size={{
                sm: 6,
                xs: 12
              }}>
                  <TextField fullWidth name="city" label="City" />
                </Grid>

                <Grid size={{
                sm: 6,
                xs: 12
              }}>
                  <TextField fullWidth name="address" label="Address" />
                </Grid>

                <Grid size={{
                sm: 6,
                xs: 12
              }}>
                  <TextField fullWidth name="zip" label="Zip/Code" />
                </Grid>

                <Grid size={12}>
                  <TextField multiline fullWidth rows={10} name="about" label="About" />
                </Grid>

                <Grid size={12}>
                  <Button type="submit" variant="contained" loading={isSubmitting}>
                    Create User
                  </Button>
                </Grid>
              </Grid>
            </FormProvider>
          </Card>
        </Grid>
      </Grid>
    </div>;
}