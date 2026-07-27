import { styled } from '@mui/material/styles';
export const StyledRoot = styled('div')(({
  theme
}) => ({
  borderRadius: 12,
  padding: '1.5rem 2rem',
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[800]
  })
}));
export const StyledParagraph = styled('p')(({
  theme
}) => ({
  gap: 4,
  fontWeight: 500,
  display: 'flex',
  paddingTop: '1.5rem',
  paddingBottom: '.5rem',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[800]
  }),
  '& .icon': {
    fontSize: 17,
    color: theme.palette.success.main
  }
}));