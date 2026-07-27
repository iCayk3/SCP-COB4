import { styled } from '@mui/material/styles';
export const Text = styled('div')(({
  theme
}) => ({
  fontSize: 14,
  marginLeft: '2.5rem',
  padding: '1rem 1.5rem',
  borderRadius: '0px 1rem 1rem 1rem',
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  })
}));