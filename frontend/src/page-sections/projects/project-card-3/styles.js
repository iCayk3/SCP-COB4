import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';

// STYLED COMPONENTS
export const StyledRoot = styled(Card)(({
  theme
}) => ({
  padding: '1.25rem',
  '& .MuiAvatarGroup-avatar': {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[300],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700]
    })
  },
  '& .content': {
    paddingTop: '1rem '
  },
  '& .img-wrapper': {
    height: 165,
    overflow: 'hidden',
    borderRadius: '8px',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }
}));