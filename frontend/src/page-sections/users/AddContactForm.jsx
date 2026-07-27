import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import CameraAlt from '@mui/icons-material/CameraAlt';
// CUSTOM COMPONENTS
import { AvatarBadge } from '@/components/avatar-badge';
import { FormProvider, TextField, DatePicker } from '@/components/form';
// CUSTOM DATA TYPES

// ==========================================================================

// ==========================================================================

export default function AddContactForm({
  handleCancel,
  user
}) {
  const initialValues = {
    firstName: user?.name || '',
    lastName: '',
    birthday: new Date(),
    company: user?.company || '',
    email: user?.email || '',
    phone: user?.phone || ''
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().min(3, 'Must be greater then 3 characters').required('First Name is Required!'),
    lastName: Yup.string().required('Last Name is Required!'),
    email: Yup.string().email('Invalid email address').required('Email is Required!'),
    birthday: Yup.date().nullable().required('Date of Birth is Required!'),
    phone: Yup.string().min(9).required('Phone Number is required!'),
    company: Yup.string().required('Company is Required!')
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
  return <div>
      <Typography variant="body1" fontWeight={500} mb={4}>
        Add Contact
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmitForm}>
        <Stack direction="row" justifyContent="center" mb={6}>
          <AvatarBadge badgeContent={<label htmlFor="icon-button-file">
                <input type="file" accept="image/*" id="icon-button-file" style={{
            display: 'none'
          }} />

                <IconButton aria-label="upload picture" component="span">
                  <CameraAlt sx={{
              fontSize: 16,
              color: 'background.paper'
            }} />
                </IconButton>
              </label>}>
            <Avatar src={user?.avatar || '/static/avatar/001-man.svg'} sx={{
            width: 80,
            height: 80,
            backgroundColor: 'grey.100'
          }} />
          </AvatarBadge>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="firstName" label="First Name" variant="outlined" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="lastName" label="Last Name" variant="outlined" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <DatePicker name="birthday" label="Birthday" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="company" label="Company" variant="outlined" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="email" type="email" label="Email" variant="outlined" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="phone" label="Phone Number" variant="outlined" />
          </Grid>
        </Grid>

        <Stack direction="row" alignItems="center" spacing={1} mt={4}>
          <Button loading={isSubmitting} type="submit">
            Save
          </Button>

          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </FormProvider>
    </div>;
}