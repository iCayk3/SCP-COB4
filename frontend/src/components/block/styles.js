import Card from '@mui/material/Card';
import { alpha, styled } from '@mui/material/styles';
export const StyledCard = styled(Card, {
  shouldForwardProp: prop => prop !== 'isTransparent'
})(({
  theme,
  isTransparent
}) => ({
  padding: 32,
  borderRadius: 12,
  boxShadow: theme.shadows[0],
  border: `1px dashed ${theme.palette.divider}`,
  backgroundColor: isTransparent ? 'transparent' : theme.palette.grey[50],
  ...theme.applyStyles('dark', {
    backgroundColor: isTransparent ? 'transparent' : alpha(theme.palette.grey[900], 0.5)
  })
}));