import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';

// STYLED COMPONENTS
export const StyledRoot = styled(Card)(({
  theme
}) => ({
  padding: '1.25rem 1.75rem',
  '.add-btn': {
    border: `1px solid ${theme.palette.divider}`
  },
  '& .MuiAvatarGroup-avatar': {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[300],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700]
    })
  },
  '& .content': {
    cursor: 'pointer',
    textAlign: 'center',
    paddingTop: '3rem ',
    paddingBottom: '2rem '
  }
}));