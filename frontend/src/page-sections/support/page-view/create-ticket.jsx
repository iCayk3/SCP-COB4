import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { FormProvider, TextField } from '@/components/form';
const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is Required!'),
  lastName: Yup.string().required('Last Name is Required!'),
  email: Yup.string().email().required('Email is Required!'),
  product: Yup.string().required('Product is Required!'),
  subject: Yup.string().required('Subject is Required!'),
  message: Yup.string().required('Message is Required!')
});
const DATA = ['Screenshots/Screen Recording is very helpful.', 'You can use snipboard.io to share screenshots.', 'And loom.com for screen recording.'];
export default function CreateTicketPageView() {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    product: 'biponi',
    subject: '',
    message: ''
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
  });
  return <div className="py-3">
      <Card sx={{
      p: 3,
      maxWidth: 900,
      margin: 'auto'
    }}>
        <Typography variant="body1" fontWeight={500}>
          Create Ticket
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{
        mb: 3
      }}>
          Please include as many details as possible about your question or problem.
        </Typography>

        <Box component="ul" pl={2} mb={4}>
          {DATA.map(item => <Box key={item} component="li" fontSize={14} pb={0.5}>
              {item}
            </Box>)}
        </Box>

        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid size={{
            md: 6,
            xs: 12
          }}>
              <TextField fullWidth name="firstName" placeholder="First Name*" />
            </Grid>

            <Grid size={{
            md: 6,
            xs: 12
          }}>
              <TextField fullWidth name="lastName" placeholder="Last Name*" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth name="email" placeholder="Email*" />
            </Grid>

            <Grid size={12}>
              <TextField select fullWidth name="product" slotProps={{
              select: {
                native: true,
                IconComponent: KeyboardArrowDown
              }
            }}>
                <option value="biponi">Biponi</option>
                <option value="bazaar">Bazaar</option>
                <option value="stocky">Stocky</option>
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField name="subject" fullWidth placeholder="Subject*" />
            </Grid>

            <Grid size={12}>
              <TextField multiline rows={6} name="message" fullWidth placeholder="Message*" />
            </Grid>

            <Grid size={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>

                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
              </FlexBox>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </div>;
}