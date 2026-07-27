import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
export const CardWrapper = styled(Card)(({
  theme
}) => ({
  padding: 20,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[0],
  justifyContent: 'space-between',
  border: `1px solid ${theme.palette.divider}`
}));