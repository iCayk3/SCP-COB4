import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// MUI
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
//  STYLED & CUSTOM COMPONENTS
import { FormProvider, TextField } from '@/components/form';
import { FormContainer, StyledFormControlLabel } from './styles';
const validationSchema = Yup.object({
  name: Yup.string().min(3, 'Must be greater then 3 characters').required('Name is Required!'),
  city: Yup.string().required('City is Required!'),
  phone: Yup.string().min(9).required('Phone is required!'),
  country: Yup.string().required('Country is Required!'),
  address: Yup.string().required('Address is Required!'),
  type: Yup.string().required('Type is Required!'),
  isDefault: Yup.boolean().optional().default(false)
});

// ==============================================================

// ==============================================================

export default function BillingForm({
  handleCancel
}) {
  const initialValues = {
    name: '',
    city: '',
    phone: '',
    country: '',
    address: '',
    type: 'home',
    isDefault: false
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
  const handleFormSubmit = handleSubmit(values => {
    console.log(values);
    handleCancel();
  });
  return <FormProvider methods={methods} onSubmit={handleFormSubmit}>
      <Typography variant="h6">Add new address</Typography>

      <FormContainer>
        <Grid container spacing={3}>
          <Grid size={12}>
            <RadioGroup row value={watch('type')} onChange={e => setValue('type', e.target.value)}>
              <StyledFormControlLabel value="home" control={<Radio />} label="Home" />
              <StyledFormControlLabel value="office" control={<Radio />} label="Office" />
            </RadioGroup>
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="name" size="small" label="Full Name" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth size="small" name="phone" label="Phone" />
          </Grid>

          <Grid size={12}>
            <TextField fullWidth size="small" name="address" label="Address" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth size="small" label="City" name="city" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth size="small" label="Country" name="country" />
          </Grid>

          <Grid size={12}>
            <div className="checkbox-wrapper">
              <Checkbox checked={watch('isDefault')} onChange={e => setValue('isDefault', e.target.checked)} />

              <Typography variant="body2">Use this address as default</Typography>
            </div>
          </Grid>

          <Grid size={12}>
            <div className="btn-group">
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>

              <Button variant="contained" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Deliver to this address'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </FormContainer>
    </FormProvider>;
}