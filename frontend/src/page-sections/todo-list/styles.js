import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
export const DroppableWrapper = styled('div')({
  height: '100%',
  padding: '1rem'
});
export const MoreButton = styled(IconButton)(({
  theme
}) => ({
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[100]}`
}));
export const TodoColumnRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  maxHeight: 750,
  boxShadow: 'none',
  backgroundColor: theme.palette.grey[50],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[800]
  })
}));