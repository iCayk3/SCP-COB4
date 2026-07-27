import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import InvoiceSummery from '../InvoiceSummery';
import { FormProvider, TextField, DatePicker } from '@/components/form';
// CUSTOM ICON COMPONENT
import Delete from '@/icons/Delete';
// STYLED COMPONENTS
import { StatusWrapper, StyledFormControl } from '../styles';
const validationSchema = Yup.object().shape({
  billTo: Yup.string().required('Bill To is Required!'),
  billToAddress: Yup.string().required('Address is Required!'),
  billToPhone: Yup.string().required('Phone is Required!'),
  billFrom: Yup.string().required('Bill From is Required!'),
  billFromAddress: Yup.string().required('Address is Required!'),
  billFromPhone: Yup.string().required('Phone is Required!'),
  status: Yup.string().default(() => 'Pending'),
  items: Yup.array().of(Yup.object().shape({
    name: Yup.string().required('Item Name Required'),
    price: Yup.number().moreThan(0, 'Price must be greater than 0').required('Price is Required'),
    qty: Yup.number().moreThan(0, 'Quantity must be greater than 0').required('Quantity is Required')
  })).default([{
    name: '',
    price: 0,
    qty: 0
  }])
});
export default function CreateInvoicePageView() {
  const navigate = useNavigate();
  const handleCancel = useCallback(() => navigate('/dashboard/invoice-list'), [navigate]);
  const initialValues = {
    orderNo: 204,
    billTo: '',
    billFrom: '',
    billToPhone: '',
    billToAddress: '',
    billFromPhone: '',
    status: 'Pending',
    billFromAddress: '',
    orderDate: new Date(),
    items: [{
      id: 1,
      name: '',
      price: 0,
      qty: 0
    }]
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = methods;

  // FOR HANDLING ITEM LIST
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    name: 'items',
    control
  });

  // FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2));
  });
  return <div className="pt-2 pb-4">
      <Card className="p-3">
        <Typography variant="body1" sx={{
        fontWeight: 500,
        mb: 2
      }}>
          Order Status
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
          <StatusWrapper>
            <RadioGroup row name="status" defaultValue={watch('status')} onChange={e => setValue('status', e.target.value)}>
              {['Pending', 'Processing', 'Delivered'].map(item => <StyledFormControl key={item} value={item} label={item} control={<Radio size="small" />} />)}
            </RadioGroup>

            <div className="buttonWrapper">
              <Button color="secondary" variant="outlined" onClick={handleCancel} sx={{
              mr: 1
            }}>
                Cancel
              </Button>

              <Button loading={isSubmitting} type="submit" variant="contained">
                Save
              </Button>
            </div>
          </StatusWrapper>

          {/* ORDER NO & ORDER DATE FIELDS */}
          <Grid container spacing={3}>
            <Grid size={{
            md: 4,
            sm: 6,
            xs: 12
          }}>
              <TextField fullWidth name="orderNo" label="Order Number" />
            </Grid>

            <Grid size={{
            md: 4,
            sm: 6,
            xs: 12
          }}>
              <DatePicker name="orderDate" label="Order Date" />
            </Grid>
          </Grid>

          <Divider sx={{
          my: 4
        }} />

          {/* BILL TO & BILL FROM FIELDS */}
          <Grid container spacing={3}>
            <Grid size={{
            md: 4,
            sm: 6,
            xs: 12
          }}>
              <Stack spacing={2}>
                <TextField fullWidth name="billTo" label="Bill to" />
                <TextField fullWidth name="billToAddress" label="Bill to Address" />
                <TextField fullWidth type="number" name="billToPhone" label="Bill to Phone" />
              </Stack>
            </Grid>

            <Grid size={{
            md: 4,
            sm: 6,
            xs: 12
          }}>
              <Stack spacing={2}>
                <TextField fullWidth name="billFrom" label="Bill From" />
                <TextField fullWidth name="billFromAddress" label="Bill from Address" />
                <TextField fullWidth type="number" name="billFromPhone" label="Bill from Phone" />
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{
          my: 4
        }} />

          {/* ITEM LIST FIELDS */}
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={12}>
              <Button variant="contained" onClick={() => append({
              name: '',
              price: 0,
              qty: 0
            })} sx={{
              marginBottom: 2
            }}>
                Add New Item
              </Button>
            </Grid>

            {fields.map((field, index) => <ItemRow key={field.id} index={index} onRemove={() => remove(index)} />)}
          </Grid>

          <Divider sx={{
          my: 4
        }} />

          {/* INVOICE TOTAL AMOUNT SUMMERY */}
          <InvoiceSummery />
        </FormProvider>
      </Card>
    </div>;
}
const ItemRow = memo(function ItemRow({
  index,
  onRemove
}) {
  return <Grid container size={12} spacing={1}>
      <Grid size={{
      md: 4,
      sm: 4,
      xs: 12
    }}>
        <TextField fullWidth size="small" label="Item Name" name={`items.${index}.name`} />
      </Grid>

      <Grid size={{
      md: 2,
      sm: 3,
      xs: 5
    }}>
        <TextField fullWidth size="small" type="number" label="Item Price" name={`items.${index}.price`} />
      </Grid>

      <Grid size={{
      md: 2,
      sm: 3,
      xs: 5
    }}>
        <TextField fullWidth size="small" type="number" label="Item Quantity" name={`items.${index}.qty`} />
      </Grid>

      <Grid size={{
      md: 2,
      sm: 2,
      xs: 2
    }}>
        <IconButton onClick={onRemove} color="error">
          <Delete />
        </IconButton>
      </Grid>
    </Grid>;
});