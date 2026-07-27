import Container from '@mui/material/Container';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
export const Heading = styled('div')(({
  theme
}) => ({
  color: 'white',
  paddingTop: '5rem',
  textAlign: 'center',
  paddingBottom: '13rem',
  [theme.breakpoints.down('sm')]: {
    paddingTop: '2rem'
  }
}));
export const StyledContainer = styled(Container)({
  zIndex: 1,
  marginTop: '-10rem',
  marginBottom: '4rem',
  position: 'relative'
});
export const StyledTableHead = styled(TableHead)(({
  theme
}) => ({
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  })
}));
export const HeadTableCell = styled(TableCell)({
  padding: '10px 16px',
  '&:first-of-type': {
    paddingLeft: 24
  },
  '&:last-of-type': {
    paddingRight: 24
  }
});
export const BodyTableCell = styled(HeadTableCell)({
  padding: '24px 16px',
  ':nth-of-type(1)': {
    minWidth: 250
  },
  ':nth-of-type(2)': {
    minWidth: 120
  }
});