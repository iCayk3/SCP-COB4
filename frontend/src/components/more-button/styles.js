import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
export const StyledIconButton = styled(IconButton)(({
  theme
}) => ({
  flexShrink: 0,
  color: theme.palette.grey[400],
  ...theme.applyStyles('dark', {
    color: theme.palette.grey[300]
  })
}));