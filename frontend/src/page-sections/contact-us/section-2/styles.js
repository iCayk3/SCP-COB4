import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

// STYLED COMPONENT
export const StyledRoot = styled('div')(({
  theme
}) => ({
  paddingBlock: '6rem',
  backgroundColor: theme.palette.grey[50],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[900]
  }),
  '& .i-frame': {
    border: 0,
    padding: 3,
    borderRadius: 16,
    display: 'block !important'
  },
  [theme.breakpoints.down('sm')]: {
    paddingBlock: '3rem'
  }
}));
export const StyledTextField = styled(TextField)(({
  theme
}) => ({
  ...theme.applyStyles('light', {
    '.MuiOutlinedInput-root': {
      backgroundColor: 'white',
      borderRadius: 8
    }
  })
}));