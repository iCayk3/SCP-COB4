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

const headCells = [{
  id: 'name',
  numeric: true,
  disablePadding: false,
  label: 'Name'
}, {
  id: 'email',
  numeric: false,
  disablePadding: false,
  label: 'Email'
}, {
  id: 'company',
  numeric: true,
  disablePadding: false,
  label: 'Company'
}, {
  id: 'role',
  numeric: true,
  disablePadding: false,
  label: 'Role'
}, {
  id: 'actions',
  numeric: true,
  disablePadding: false,
  label: 'Actions'
}
//   { id: "" },
];
export default function UserTableHead({
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
  const isAllSelected = rowCount > 0 && numSelected === rowCount;
  const isIndeterminate = numSelected > 0 && numSelected < rowCount;
  return <StyledTableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox size="small" color="primary" checked={isAllSelected} onChange={onSelectAllRows} indeterminate={isIndeterminate} />
        </TableCell>

        {headCells.map(headCell => <HeaderCell key={headCell.id} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : 'asc'}>
              {headCell.label}
              {orderBy === headCell.id ? <span style={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span> : null}
            </TableSortLabel>
          </HeaderCell>)}
      </TableRow>
    </StyledTableHead>;
}