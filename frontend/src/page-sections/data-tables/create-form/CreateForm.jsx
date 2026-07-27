import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Modal } from '@/components/modal';
import { Scrollbar } from '@/components/scrollbar';
import { FormProvider, TextField } from '@/components/form';
const validationSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Too Short').required('Name is Required!'),
  username: Yup.string().min(3, 'Too Short').required('Username is Required!'),
  email: Yup.string().required('Email is Required!'),
  position: Yup.string().required('Position is Required!'),
  phone: Yup.string().required('Phone is Required!'),
  address: Yup.string().required('Address is Required!'),
  dateOfBirth: Yup.string().required('Date Of Birth is Required!'),
  experience: Yup.number().required('Experience is Required!'),
  team: Yup.number().required('Team Member is Required!'),
  status: Yup.string().required('Status is Required!')
});

// ======================================================================================

// ======================================================================================

export default function CreateForm({
  open,
  onClose,
  edit,
  data
}) {
  const initialValues = {
    team: data?.team || 1,
    name: data?.name || '',
    phone: data?.phone || '',
    email: data?.email || '',
    position: data?.role || '',
    status: data?.status || '',
    address: data?.address || '',
    username: data?.username || '',
    experience: data?.experience || 1,
    dateOfBirth: data?.dateOfBirth || ''
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
  const handleFormSubmit = handleSubmit(values => {
    console.log(values);
    onClose();
  });
  return <Modal open={open} handleClose={onClose}>
      <Typography variant="h6" sx={{
      mb: 2
    }}>
        {edit ? 'Edit User' : 'Add New User'}
      </Typography>

      <FormProvider methods={methods} onSubmit={handleFormSubmit}>
        <Scrollbar style={{
        maxHeight: 400
      }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField fullWidth size="small" name="name" label="Name" placeholder="Name" />
            </Grid>

            <Grid size={6}>
              <TextField fullWidth size="small" name="username" label="Username" placeholder="Username" />
            </Grid>

            <Grid size={6}>
              <TextField fullWidth size="small" name="email" label="Email" placeholder="uilib@gmail.com" />
            </Grid>

            <Grid size={6}>
              <TextField fullWidth size="small" label="Date of Birth" name="dateOfBirth" placeholder="yyyy/mm/day" />
            </Grid>

            <Grid size={6}>
              <TextField fullWidth size="small" name="phone" label="Phone" placeholder="Phone" />
            </Grid>

            <Grid size={6}>
              <TextField fullWidth size="small" name="address" label="Address" placeholder="Address" />
            </Grid>

            <Grid size={6}>
              <TextField fullWidth size="small" name="position" label="Position" placeholder="developer" />
            </Grid>

            <Grid size={6}>
              <TextField fullWidth size="small" type="number" name="experience" label="Experience" placeholder="Experience" />
            </Grid>

            <Grid size={6}>
              <TextField fullWidth name="team" size="small" type="number" label="Team Size" placeholder="10" />
            </Grid>

            <Grid size={6}>
              <TextField fullWidth size="small" name="status" label="Status" placeholder="Full Time" />
            </Grid>
          </Grid>
        </Scrollbar>

        <Box display="flex" gap={2} mt={4}>
          <Button fullWidth variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button fullWidth type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </FormProvider>
    </Modal>;
}