import AvatarGroup from '@mui/material/AvatarGroup';
import { styled, alpha } from '@mui/material/styles';

// STYLED COMPONENTS
export const StyledAvatarGroup = styled(AvatarGroup)({
  '& .MuiAvatarGroup-avatar': {
    width: 25,
    height: 25
  }
});
export const IconWrapper = styled('div', {
  shouldForwardProp: prop => prop !== 'color'
})(({
  color
}) => ({
  width: 35,
  height: 35,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  backgroundColor: alpha(color, 0.2)
}));