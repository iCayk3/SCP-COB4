import { styled, alpha } from '@mui/material/styles';
export const StyledSpan = styled('span', {
  shouldForwardProp: prop => prop !== 'type'
})(({
  theme,
  type
}) => ({
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 500,
  borderRadius: 12,
  padding: '.25rem .4rem',
  ...(type === 'primary' && {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary[25],
    ...theme.applyStyles('dark', {
      backgroundColor: alpha(theme.palette.primary.main, 0.2)
    })
  }),
  ...(type === 'success' && {
    color: theme.palette.success[500],
    backgroundColor: theme.palette.success[50],
    ...theme.applyStyles('dark', {
      backgroundColor: alpha(theme.palette.success.main, 0.2)
    })
  }),
  ...(type === 'error' && {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error[50],
    ...theme.applyStyles('dark', {
      backgroundColor: alpha(theme.palette.error.main, 0.2)
    })
  })
}));