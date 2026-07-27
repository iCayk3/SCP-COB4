import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
// CUSTOM COMPONENTS
import { FormProvider, TextField } from '@/components/form';
export default function InfoForm() {
  const initialValues = {
    firstName: 'Pixy',
    lastName: 'Krovasky',
    email: 'uilib@gmail.com',
    phone: '+443322221111',
    organization: 'UiLib',
    department: 'Develop',
    country: 'usa',
    state: 'New York',
    address: 'Corverview, Michigan',
    zipCode: 4336
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().min(3, 'Must be greater then 3 characters').required('First Name is Required!'),
    lastName: Yup.string().required('Last Name is Required!'),
    email: Yup.string().email('Invalid email address').required('Email is Required!'),
    phone: Yup.string().min(9).required('Phone Number is required!'),
    organization: Yup.string().required('Organization is Required!'),
    department: Yup.string().required('Department is Required!'),
    country: Yup.string().required('Country is Required!'),
    state: Yup.string().required('State is Required!'),
    address: Yup.string().required('Address is Required!'),
    zipCode: Yup.number().required('Zip Code is Required!')
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
  return <Card sx={{
    mt: 3
  }}>
      <Typography variant="body1" sx={{
      padding: '1rem 1.5rem',
      fontWeight: 500
    }}>
        Basic Information
      </Typography>

      <Divider />

      <FormProvider methods={methods} onSubmit={handleSubmitForm}>
        <div className="p-3">
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
              <TextField fullWidth name="email" label="Email" variant="outlined" />
            </Grid>

            <Grid size={{
            sm: 6,
            xs: 12
          }}>
              <TextField fullWidth name="phone" label="Phone" variant="outlined" />
            </Grid>

            <Grid size={{
            sm: 6,
            xs: 12
          }}>
              <TextField fullWidth name="organization" variant="outlined" label="Organization" />
            </Grid>

            <Grid size={{
            sm: 6,
            xs: 12
          }}>
              <TextField fullWidth name="department" variant="outlined" label="Department" />
            </Grid>

            <Grid size={{
            sm: 6,
            xs: 12
          }}>
              <TextField select fullWidth name="country" label="Country" variant="outlined" placeholder="Country" slotProps={{
              select: {
                native: true,
                IconComponent: KeyboardArrowDown
              }
            }}>
                <option value="usa">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="uae">United Arab Emirates</option>
              </TextField>
            </Grid>

            <Grid size={{
            sm: 6,
            xs: 12
          }}>
              <TextField fullWidth name="state" label="State" variant="outlined" />
            </Grid>

            <Grid size={{
            sm: 6,
            xs: 12
          }}>
              <TextField fullWidth name="address" label="Address" variant="outlined" />
            </Grid>

            <Grid size={{
            sm: 6,
            xs: 12
          }}>
              <TextField fullWidth type="number" name="zipCode" label="Zip Code" variant="outlined" />
            </Grid>

            <Grid size={12}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Save Changes
              </Button>

              <Button variant="outlined" sx={{
              ml: 2
            }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </div>
      </FormProvider>
    </Card>;
}