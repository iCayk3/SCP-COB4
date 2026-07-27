import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Star from '@mui/icons-material/Star';
// CUSTOM COMPONENTS
import { FormProvider, TextField } from '@/components/form';
const validationSchema = Yup.object({
  rating: Yup.number().required('Rating is Required!'),
  review: Yup.string().required('Review is Required!'),
  email: Yup.string().required('Email is Required!'),
  name: Yup.string().required('Name is required!')
});
export default function ReviewForm() {
  const initialValues = {
    rating: 2,
    review: '',
    email: '',
    name: ''
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

  // FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2));
  });
  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Stack direction="row" spacing={1}>
        <Typography variant="body2">Your review about this product:</Typography>

        <Rating value={watch('rating')} onChange={(_, newValue) => setValue('rating', newValue)} emptyIcon={<Star sx={{
        opacity: 0.4,
        fontSize: 'inherit'
      }} />} sx={{
        color: 'warning.main',
        fontSize: 18
      }} />
      </Stack>

      <Stack spacing={2} mt={3}>
        <TextField rows={4} fullWidth multiline placeholder="Review" name="review" />
        <TextField placeholder="Name" fullWidth name="name" />
        <TextField placeholder="Email" fullWidth name="email" />
      </Stack>

      <Stack direction="row" spacing={2} mt={2} justifyContent="end">
        <Button variant="outlined" color="secondary">
          Cancel
        </Button>

        <Button loading={isSubmitting} type="submit">
          Post Review
        </Button>
      </Stack>
    </FormProvider>;
}