import { Fragment, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENT
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
// CUSTOM COMPONENTS
import { Link } from '@/components/link';
import { DropZone } from '@/components/dropzone';
import { SectionTitle } from '@/components/section-title';
import { FormProvider, TextField } from '@/components/form';
import HeaderEffect from '@/layouts/root/HeaderEffect';
// STYLED COMPONENT
import { Heading, StyledContainer } from './styles';
const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is Required!'),
  lastName: Yup.string().required('Last Name is Required!'),
  email: Yup.string().email().required('Email is Required!'),
  phone: Yup.string().min(9, 'Phone must be at least 9 digits').required('Phone is required!'),
  position: Yup.string().required('Position is required!'),
  portfolio: Yup.string().required('Portfolio is required!'),
  expectedSalary: Yup.string().required('Expected Salary is required!'),
  cv: Yup.mixed().nullable().test('required', 'CV is required!', value => value ? true : false).default(null),
  coverLetter: Yup.mixed().nullable().test('required', 'Cover Letter is required!', value => value ? true : false).default(null)
});
export default function CareerApplyPageView() {
  const initialValues = {
    email: '',
    phone: '',
    position: 'ui-ux',
    lastName: '',
    firstName: '',
    portfolio: '',
    expectedSalary: '',
    coverLetter: null,
    cv: null
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    setError,
    setValue,
    handleSubmit,
    formState: {
      isSubmitting,
      errors
    }
  } = methods;
  const handleFormSubmit = handleSubmit(values => {
    console.log(values);
  });
  const handleDrop = useCallback(field => (files, rejections) => {
    if (rejections.length > 0) {
      setError(field, {
        message: rejections[0].errors[0].message
      });
    } else {
      setValue(field, files[0], {
        shouldValidate: true
      });
    }
  }, [setError, setValue]);
  return <Fragment>
      <HeaderEffect>
        <Heading>
          <SectionTitle centered title="Job Application Form" />
          <Typography variant="body1">Please fill in your details below</Typography>
        </Heading>
      </HeaderEffect>

      <StyledContainer maxWidth="md">
        <Card className="p-3">
          <FormProvider methods={methods} onSubmit={handleFormSubmit}>
            <Grid container spacing={3}>
              <Grid size={{
              md: 6,
              xs: 12
            }}>
                <TextField fullWidth size="medium" name="firstName" label="First Name" />
              </Grid>

              <Grid size={{
              md: 6,
              xs: 12
            }}>
                <TextField fullWidth size="medium" name="lastName" label="Last Name" />
              </Grid>

              <Grid size={{
              md: 6,
              xs: 12
            }}>
                <TextField fullWidth name="email" size="medium" label="Email" />
              </Grid>

              <Grid size={{
              md: 6,
              xs: 12
            }}>
                <TextField fullWidth name="phone" size="medium" label="Phone" />
              </Grid>

              <Grid size={12}>
                <TextField select fullWidth size="medium" name="position" label="Position" slotProps={{
                select: {
                  native: true,
                  IconComponent: KeyboardArrowDown
                }
              }}>
                  <option value="ui-ux">UI/UX Designer</option>
                  <option value="front-end">Front End Developer</option>
                  <option value="software">Software Engineer</option>
                </TextField>
              </Grid>

              <Grid size={12}>
                <TextField fullWidth size="medium" name="portfolio" label="Portfolio" />
              </Grid>

              <Grid size={12}>
                <TextField fullWidth size="medium" name="expectedSalary" label="Expected Salary*" />
              </Grid>

              <Grid size={12}>
                <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{
                mb: 2
              }}>
                  Upload your CV *
                </Typography>

                <DropZone onDrop={handleDrop('cv')} error={errors.cv?.message} />
              </Grid>

              <Grid size={12}>
                <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{
                mb: 2
              }}>
                  Upload cover letter
                </Typography>

                <DropZone onDrop={handleDrop('coverLetter')} error={errors.coverLetter?.message} />
              </Grid>

              <Grid size={12}>
                <div className="buttons">
                  <Button size="large" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Applying...' : 'Apply'}
                  </Button>

                  <Button size="large" color="secondary" variant="outlined" LinkComponent={Link} href="/career">
                    Cancel
                  </Button>
                </div>
              </Grid>
            </Grid>
          </FormProvider>
        </Card>
      </StyledContainer>
    </Fragment>;
}