import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
// MUI ICON COMPONENTS
import GitHub from '@mui/icons-material/GitHub';
import LinkedIn from '@mui/icons-material/LinkedIn';
// CUSTOM ICON COMPONENTS
import Twitter from '@/icons/social/Twitter';
import Facebook from '@/icons/social/Facebook';
// CUSTOM COMPONENTS
import { FormProvider, TextField } from '@/components/form';
const validationSchema = Yup.object({
  name: Yup.string().required('First Name is Required!'),
  email: Yup.string().email('Invalid Email Address').required('Email is Required!'),
  subject: Yup.string().required('Subject is Required!')
});

// STYLED COMPONENTS
const IconGroup = styled('div')(({
  theme
}) => ({
  display: 'flex',
  borderRadius: 16,
  marginTop: '1.5rem',
  alignItems: 'center',
  paddingBlock: '1.5rem',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  '.icon': {
    color: theme.palette.grey[500]
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  })
}));
export default function Contact() {
  const initialValues = {
    name: '',
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
  return <Card className="p-3">
      <Grid container spacing={3}>
        <Grid size={{
        lg: 6,
        xs: 12
      }}>
          <Typography variant="body1" fontWeight={500} sx={{
          mb: 3
        }}>
            Send us Email
          </Typography>

          <FormProvider methods={methods} onSubmit={handleFormSubmit}>
            <Stack spacing={3} alignItems="start">
              <TextField fullWidth name="name" placeholder="Name*" />
              <TextField fullWidth type="email" name="email" placeholder="Email*" />
              <TextField fullWidth name="subject" placeholder="Subject" />
              <TextField multiline fullWidth rows={4} name="message" placeholder="Message" />
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Stack>
          </FormProvider>
        </Grid>

        <Grid size={{
        lg: 6,
        xs: 12
      }}>
          <Card sx={{
          p: 1
        }}>
            <iframe width="100%" height="400" loading="lazy" allowFullScreen src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.7375391255605!2d91.85643162915974!3d24.906932698467063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375055a8dba315db%3A0xfed40d384aacd295!2sUI%20Lib!5e0!3m2!1sen!2sbd!4v1676372525624!5m2!1sen!2sbd" style={{
            border: 0
          }} />
          </Card>
        </Grid>

        <Grid size={12}>
          <IconGroup>
            <Typography variant="body1" fontWeight={500}>
              Follow More
            </Typography>

            <div>
              <IconButton>
                <Facebook className="icon" />
              </IconButton>

              <IconButton>
                <Twitter className="icon" />
              </IconButton>

              <IconButton>
                <LinkedIn className="icon" />
              </IconButton>

              <IconButton>
                <GitHub className="icon" />
              </IconButton>
            </div>
          </IconGroup>
        </Grid>
      </Grid>
    </Card>;
}