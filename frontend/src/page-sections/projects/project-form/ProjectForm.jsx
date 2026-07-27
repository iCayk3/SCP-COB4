import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// MUI
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Add from '@mui/icons-material/Add';
// CUSTOM COMPONENTS
import { Modal } from '@/components/modal';
import { DropZone } from '@/components/dropzone';
import { FormProvider, TextField, DatePicker } from '@/components/form';

// STYLED COMPONENT
const StyledStack = styled(Stack)(({
  theme
}) => ({
  '& .add-btn': {
    border: `1px solid ${theme.palette.divider}`
  },
  '& .label': {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
    display: 'block'
  },
  '& .btn-group': {
    gap: '1rem',
    display: 'flex',
    paddingTop: '1.5rem'
  }
}));
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is Required!'),
  description: Yup.string().required('Description is Required!'),
  deadline: Yup.date().required('Deadline is Required!')
});

// ==============================================================

// ==============================================================

export default function ProjectForm({
  open,
  handleClose
}) {
  const initialValues = {
    name: '',
    image: '',
    members: [],
    description: '',
    deadline: new Date()
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
  const handleSubmitForm = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2));
  });
  return <Modal open={open} handleClose={handleClose}>
      <FormProvider methods={methods} onSubmit={handleSubmitForm}>
        <StyledStack spacing={2}>
          <div>
            <p className="label">Project Name</p>
            <TextField fullWidth size="small" name="name" placeholder="Project name" />
          </div>

          <div>
            <p className="label">Deadline</p>
            <DatePicker name="deadline" label="" />
          </div>

          <div>
            <p className="label">Description</p>
            <TextField rows={2} fullWidth multiline size="small" name="description" placeholder="Description" />
          </div>

          <div>
            <p className="label">Add Picture</p>
            <DropZone />
          </div>

          <div>
            <p className="label">Team</p>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton className="add-btn">
                <Add fontSize="small" />
              </IconButton>

              <Avatar alt="Remy Sharp" src="/static/user/user-7.png" />
              <Avatar alt="Travis Howard" src="/static/user/user-6.png" />
              <Avatar alt="Cindy Baker" src="/static/user/user-5.png" />
            </Stack>
          </div>

          <div className="btn-group">
            <Button loading={isSubmitting} variant="contained" fullWidth>
              Create
            </Button>

            <Button variant="outlined" fullWidth onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </StyledStack>
      </FormProvider>
    </Modal>;
}