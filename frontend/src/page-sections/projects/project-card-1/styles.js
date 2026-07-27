import Card from '@mui/material/Card';
import AvatarGroup from '@mui/material/AvatarGroup';
import { styled } from '@mui/material/styles';

// STYLED COMPONENTS
export const StyledAvatarGroup = styled(AvatarGroup)(({
  theme
}) => ({
  justifyContent: 'flex-end',
  '& .MuiAvatarGroup-avatar': {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[300],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700]
    })
  }
}));
export const StyledRoot = styled(Card)(({
  theme
}) => ({
  padding: '1.25rem 1.75rem',
  '.add-btn': {
    border: `1px solid ${theme.palette.divider}`
  },
  '.truncate': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
}));