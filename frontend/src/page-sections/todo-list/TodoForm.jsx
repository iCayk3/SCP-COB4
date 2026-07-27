import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Add from '@mui/icons-material/Add';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { FormProvider, TextField, DatePicker } from '@/components/form';
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is Required!'),
  date: Yup.date().required('Date is Required!').nullable().test('required', 'Date is Required!', value => value !== null),
  description: Yup.string().required('Description is Required!'),
  mentionClient: Yup.string().default(''),
  statusColor: Yup.string().default('#61A9FF')
});
const INITIAL_VALUES = {
  title: '',
  date: null,
  description: '',
  mentionClient: '',
  statusColor: '#61A9FF'
};
const STATUS_COLORS = [{
  value: '#61A9FF',
  color: 'primary'
}, {
  value: '#2CC5BD',
  color: 'success'
}, {
  value: '#FD396D',
  color: 'error'
}, {
  value: '#A798FF',
  color: 'info'
}];

// ==================================================================

// ==================================================================

export default function TodoForm({
  show,
  title,
  handleClose,
  handleOpen
}) {
  const methods = useForm({
    defaultValues: INITIAL_VALUES,
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
    handleClose();
    console.log(values);
  });
  return <ClickAwayListener onClickAway={handleClose}>
      <Box padding="1rem">
        <Typography variant="body1" fontWeight={500}>
          {title}
        </Typography>

        <Button fullWidth variant="contained" onClick={handleOpen} sx={{
        my: '1rem',
        display: show ? 'none' : 'auto'
      }}>
          <Add />
        </Button>

        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          <Box mt={2} display={show ? 'auto' : 'none'}>
            <Stack spacing={1}>
              <TextField fullWidth size="small" name="title" placeholder="Title" />

              <DatePicker name="date" label="Date" />

              <TextField fullWidth size="small" name="mentionClient" placeholder="@mention Client" />

              <TextField rows={5} fullWidth multiline size="small" name="description" placeholder="Description" />

              <FlexBox alignItems="center">
                <FormLabel component="small" sx={{
                color: 'text.secondary'
              }}>
                  Select Color
                </FormLabel>

                <RadioGroup row name="statusColor" value={watch('statusColor')} onChange={e => setValue('statusColor', e.target.value)}>
                  {STATUS_COLORS.map(({
                  value,
                  color
                }) => <Radio key={value} value={value} size="small" color={color} />)}
                </RadioGroup>
              </FlexBox>
            </Stack>

            <FlexBox gap={2} mt={2}>
              <Button fullWidth type="submit" disabled={isSubmitting}>
                Save
              </Button>

              <Button fullWidth color="secondary" variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </FlexBox>
          </Box>
        </FormProvider>
      </Box>
    </ClickAwayListener>;
}