// MUI
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import visuallyHidden from '@mui/utils/visuallyHidden';

// ==============================================================

// ==============================================================

const headCells = [{
  id: 'name',
  numeric: false,
  disablePadding: false,
  label: 'Folder Name'
}, {
  id: 'items',
  numeric: true,
  disablePadding: false,
  label: 'File Items'
}, {
  id: 'size',
  numeric: true,
  disablePadding: false,
  label: 'File Size'
}, {
  id: 'date',
  numeric: true,
  disablePadding: false,
  label: 'Created Date'
}, {
  id: ''
}];
export default function FileManagerTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllRows
}) {
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };
  return <TableHead sx={{
    backgroundColor: 'action.hover'
  }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox size="small" color="primary" onChange={onSelectAllRows} checked={rowCount > 0 && numSelected === rowCount} indeterminate={numSelected > 0 && numSelected < rowCount} />
        </TableCell>

        {headCells.map(headCell => <TableCell key={headCell.id} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false} sx={{
        color: 'text.primary',
        fontWeight: 600
      }}>
            <TableSortLabel active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : 'asc'}>
              {headCell.label}
              {orderBy === headCell.id ? <span style={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span> : null}
            </TableSortLabel>
          </TableCell>)}
      </TableRow>
    </TableHead>;
}