import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
export const HeadTableCell = styled(TableCell)(({
  theme
}) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.action.hover
  })
}));
export const BodyTableCell = styled(HeadTableCell)({
  fontSize: 13,
  fontWeight: 400,
  padding: '1rem',
  backgroundColor: 'transparent'
});
export const BodyTableRow = styled(TableRow, {
  shouldForwardProp: prop => prop !== 'active'
})(({
  theme,
  active
}) => ({
  cursor: 'pointer',
  ...(active && {
    backgroundColor: theme.palette.action.selected
  })
}));