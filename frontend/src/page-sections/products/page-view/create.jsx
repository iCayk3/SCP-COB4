import { useCallback } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
// CUSTOM COMPONENTS
import { DropZone } from '@/components/dropzone';
import { FlexBox } from '@/components/flexbox';
import { FormProvider, TextField } from '@/components/form';
// CUSTOM ICON COMPONENT
import ShoppingBasket from '@/icons/ShoppingBasket';
const validationSchema = Yup.object({
  manufacturer: Yup.string().required('Manufacturer is Required!'),
  model: Yup.string().required('Model is Required!'),
  id: Yup.string().required('ID Number is Required!'),
  priority: Yup.string().min(9).required('Priority is required!'),
  name: Yup.string().required('Name is Required!'),
  category: Yup.string().required('Category is Required!'),
  pro_model: Yup.string().required('Model is Required!'),
  meta_title: Yup.string().required('Meta Title is Required!'),
  meta_tags: Yup.string().required('Meta Tags is Required!'),
  address: Yup.string().required('Address is Required!'),
  zipCode: Yup.string().required('Zip Code is Required!'),
  image: Yup.mixed().nullable().default(null)
});
export default function CreateProductPageView() {
  const initialValues = {
    manufacturer: '',
    model: '',
    id: '',
    priority: '',
    name: '',
    pro_model: '',
    meta_title: '',
    meta_tags: '',
    address: '',
    zipCode: '',
    category: 'electronics',
    image: null
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
      isSubmitting
    }
  } = methods;
  const handleSubmitForm = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2));
  });
  const handleDropFile = useCallback((files, rejections) => {
    if (rejections.length > 0) {
      setError('image', {
        message: rejections[0].errors[0].message
      });
    } else {
      setValue('image', files[0], {
        shouldValidate: true
      });
    }
  }, [setError, setValue]);
  return <div className="pt-2 pb-4">
      <FormProvider methods={methods} onSubmit={handleSubmitForm}>
        <Card className="p-3">
          <Grid container spacing={3} alignItems="start">
            <Grid size={12}>
              <FlexBox gap={1} alignItems="center">
                <Avatar variant="rounded" sx={theme => ({
                width: 36,
                height: 36,
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              })}>
                  <ShoppingBasket sx={{
                  color: 'primary.main',
                  fontSize: 22
                }} />
                </Avatar>

                <Typography variant="body1" fontWeight={500}>
                  Create New Product
                </Typography>
              </FlexBox>
            </Grid>

            <Grid container spacing={2} size={{
            md: 6,
            xs: 12
          }}>
              <Grid size={12}>
                <Typography variant="body2" fontWeight={500}>
                  Main Parameters
                </Typography>
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField fullWidth name="manufacturer" label="Manufacturer" />
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField fullWidth label="Model" name="model" />
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField fullWidth name="id" label="ID Number" />
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField fullWidth name="priority" label="Priority" />
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField select fullWidth name="category" label="Category" slotProps={{
                select: {
                  native: true,
                  IconComponent: KeyboardArrowDown
                }
              }}>
                  <option value="electronics">Electronics</option>
                  <option value="gadget">Gadget</option>
                  <option value="shoes">Shoes</option>
                </TextField>
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField fullWidth label="Model" name="pro_model" />
              </Grid>

              <Grid size={12}>
                <TextField name="meta_title" label="Meta Title" fullWidth />
              </Grid>

              <Grid size={12}>
                <TextField name="meta_tags" label="Meta Tags" fullWidth />
              </Grid>

              <Grid size={12}>
                <TextField name="meta_description" label="Meta Description" fullWidth />
              </Grid>
            </Grid>

            <Grid container spacing={2} size={{
            md: 6,
            xs: 12
          }}>
              <Grid size={12}>
                <Typography variant="body2" fontWeight={500}>
                  Prices and Warehouses
                </Typography>
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField name="cost" label="Cost" fullWidth />
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField name="extra" label="Extra" fullWidth />
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField name="price" label="Price" fullWidth />
              </Grid>

              <Grid size={{
              sm: 6,
              xs: 12
            }}>
                <TextField fullWidth name="availability" label="Availability" />
              </Grid>

              <Grid size={12}>
                <TextField fullWidth multiline rows={9} name="description" label="Product Description" />
              </Grid>
            </Grid>
          </Grid>
        </Card>

        <Card sx={{
        my: 3
      }}>
          <DropZone onDrop={handleDropFile} />
        </Card>

        <FlexBox flexWrap="wrap" gap={2}>
          <Button loading={isSubmitting} type="submit" variant="contained">
            Create New Product
          </Button>

          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
        </FlexBox>
      </FormProvider>
    </div>;
}