import { useCallback } from 'react';
// MUI
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { styled } from '@mui/material/styles';

// STYLED COMPONENTS
const StyledTableHead = styled(TableHead)(({
  theme
}) => ({
  backgroundColor: theme.palette.action.hover
}));
const HeaderCell = styled(TableCell)(({
  theme
}) => ({
  fontWeight: 500,
  color: theme.palette.text.primary
}));

// ==============================================================

// ==============================================================

// TABLE HEAD COLUMN DATA
const headCells = [{
  id: 'name',
  numeric: true,
  disablePadding: false,
  label: 'Name'
}, {
  id: 'email',
  numeric: true,
  disablePadding: false,
  label: 'Email'
}, {
  id: 'date',
  numeric: true,
  disablePadding: false,
  label: 'Date'
}, {
  id: 'status',
  numeric: true,
  disablePadding: false,
  label: 'Status'
}, {
  id: '',
  numeric: true,
  disablePadding: false,
  label: 'Edit'
}];
export default function InvoiceTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllRows
}) {
  const createSortHandler = useCallback(property => event => {
    onRequestSort(event, property);
  }, [onRequestSort]);
  return <StyledTableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox size="small" color="primary" onChange={onSelectAllRows} checked={rowCount > 0 && numSelected === rowCount} indeterminate={numSelected > 0 && numSelected < rowCount} />
        </TableCell>

        {headCells.map(headCell => <HeaderCell key={headCell.id} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : 'asc'}>
              {headCell.label}
              {orderBy === headCell.id && <span style={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>}
            </TableSortLabel>
          </HeaderCell>)}
      </TableRow>
    </StyledTableHead>;
}