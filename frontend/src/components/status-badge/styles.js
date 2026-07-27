import { alpha, styled } from '@mui/material/styles';
export const Status = styled('p', {
  shouldForwardProp: prop => prop !== 'type'
})(({
  theme,
  type
}) => ({
  borderRadius: 6,
  padding: '.2rem .7rem',
  display: 'inline-block',
  ...(type === 'warning' && {
    color: theme.palette.warning[600],
    backgroundColor: theme.palette.warning[50],
    ...theme.applyStyles('dark', {
      backgroundColor: alpha(theme.palette.warning[900], 0.3)
    })
  }),
  ...(type === 'success' && {
    color: theme.palette.success[600],
    backgroundColor: theme.palette.success[50],
    ...theme.applyStyles('dark', {
      backgroundColor: alpha(theme.palette.success[900], 0.3)
    })
  }),
  ...(type === 'primary' && {
    color: theme.palette.primary[500],
    backgroundColor: theme.palette.primary[50],
    ...theme.applyStyles('dark', {
      backgroundColor: alpha(theme.palette.primary[900], 0.3)
    })
  }),
  ...(type === 'error' && {
    color: theme.palette.error[500],
    backgroundColor: theme.palette.error[50],
    ...theme.applyStyles('dark', {
      backgroundColor: alpha(theme.palette.error[900], 0.3)
    })
  })
}));