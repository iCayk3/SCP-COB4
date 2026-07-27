import InputBase from '@mui/material/InputBase';
import { iconButtonClasses } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
export const StyledInputBase = styled(InputBase, {
  shouldForwardProp: prop => prop !== 'colors' && prop !== 'variant' && prop !== 'button'
})(({
  theme,
  colors,
  variant,
  button
}) => ({
  padding: 4,
  borderRadius: variant === 'circular' ? 32 : 6,
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiInputBase-input': {
    maxWidth: 30,
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center'
  },
  [`& .${iconButtonClasses.root}`]: {
    color: theme.palette.grey[400],
    borderRadius: variant === 'circular' ? 32 : 4,
    backgroundColor: theme.palette.grey[100],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700]
    }),
    ...(colors === 'dark' && {
      backgroundColor: 'white'
    })
  },
  ...(colors === 'dark' && {
    border: 0,
    backgroundColor: theme.palette.grey[100]
  }),
  ...(button === 'outlined' && {
    [`& .${iconButtonClasses.root}`]: {
      backgroundColor: 'white',
      color: theme.palette.grey[400],
      borderRadius: variant === 'circular' ? 32 : 4,
      border: `1px solid ${theme.palette.grey[200]}`,
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[700]
      })
    }
  })
}));