import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// MUI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { DropZone } from '@/components/dropzone';
import { FormProvider, TextField } from '@/components/form';
// CUSTOM LAYOUT COMPONENT
import Layout from '../Layout';
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is Required!'),
  subject: Yup.string().required('Subject is Required!'),
  message: Yup.string().required('Message is required!'),
  cc: Yup.string().email('Invalid email').optional().default('')
});
export default function ComposeMailPageView() {
  const initialValues = {
    cc: '',
    email: '',
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
  return <Layout showTopActions={false}>
      <Typography variant="body1" fontWeight={500} className="p-3">
        Compose Mail
      </Typography>

      <Divider />

      <div className="p-3">
        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField fullWidth type="email" name="email" placeholder="To email*" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth type="email" name="cc" placeholder="CC (If any)" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth name="subject" placeholder="Subject*" />
            </Grid>

            <Grid size={12}>
              <TextField fullWidth name="message" placeholder="Message*" />
            </Grid>

            <Grid size={12}>
              <DropZone onDrop={() => {}} />
            </Grid>

            <Grid size={12}>
              <FlexBox alignItems="center" gap={2}>
                <Button loading={isSubmitting} type="submit">
                  Send
                </Button>

                <Button variant="outlined" color="secondary">
                  Save as Draft
                </Button>
              </FlexBox>
            </Grid>
          </Grid>
        </FormProvider>
      </div>
    </Layout>;
}