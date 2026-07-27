import { alpha, styled } from '@mui/material/styles';
export const RootStyle = styled('div', {
  shouldForwardProp: prop => prop !== 'isDragActive' && prop !== 'error'
})(({
  theme,
  isDragActive,
  error
}) => ({
  padding: 32,
  borderRadius: 16,
  cursor: 'pointer',
  textAlign: 'center',
  border: `1px dashed ${theme.palette.divider}`,
  '.icon': {
    fontSize: 38,
    color: theme.palette.text.secondary
  },
  ...(isDragActive && {
    borderColor: theme.palette.grey[500],
    backgroundColor: theme.palette.action.hover
  }),
  ...(error && {
    borderColor: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.02)
  })
}));
export const ErrorMessage = styled('p')(({
  theme
}) => ({
  fontSize: 12,
  marginTop: '.5rem',
  marginInlineStart: '1rem',
  color: theme.palette.error.main
}));