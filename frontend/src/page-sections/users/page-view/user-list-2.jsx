import { useCallback, useMemo, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { TableDataNotFound } from '@/components/table';
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from '../SearchArea';
import UserDetails from '../UserDetails';
import UserTableRowTwo from '../user-list-2/UserTableRowTwo';
// CUSTOM DEFINED HOOK
import { useMuiTable, getComparator, stableSort } from '@/hooks/useMuiTable';
// CUSTOM DUMMY DATA
import { USER_LIST } from '@/__fakeData__/users';
// STYLED COMPONENTS
import { HeadTableCell } from '../user-list-2/styles';
const headCells = [{
  id: 'name',
  numeric: true,
  disablePadding: false,
  label: 'Name'
}, {
  id: 'position',
  numeric: true,
  disablePadding: false,
  label: 'Position'
}, {
  id: 'company',
  numeric: true,
  disablePadding: false,
  label: 'Company'
}, {
  id: 'email',
  numeric: true,
  disablePadding: false,
  label: 'Email'
}, {
  id: 'phone',
  numeric: true,
  disablePadding: false,
  label: 'Phone'
}];
export default function UserList2PageView() {
  const [users] = useState([...USER_LIST]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState();
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    handleChangePage,
    handleRequestSort,
    handleChangeRowsPerPage
  } = useMuiTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10
  });
  const filteredUsers = useMemo(() => {
    const sortedUsers = stableSort(users, getComparator(order, orderBy));
    if (!searchFilter) return sortedUsers;
    const searchTerm = searchFilter.toLowerCase();
    return sortedUsers.filter(item => item.name.toLowerCase().includes(searchTerm));
  }, [users, order, orderBy, searchFilter]);
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);
  const handleSearchChange = useCallback(e => {
    setSearchFilter(e.target.value);
  }, []);
  return <div className="pt-2 pb-4">
      <Grid container>
        <Grid size={{
        lg: 9,
        md: 8,
        xs: 12
      }}>
          <Card sx={{
          height: '100%',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          boxShadow: '2px 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
            {/* SEARCH BOX AREA */}
            <Box px={3}>
              <SearchArea value={searchFilter} onChange={handleSearchChange} gridRoute="/dashboard/user-grid-2" listRoute="/dashboard/user-list-2" />
            </Box>

            {/* TABLE HEAD & BODY ROWS */}
            <TableContainer>
              <Scrollbar autoHide={false}>
                <Table>
                  {/* TABLE HEADER */}
                  <TableHead>
                    <TableRow>
                      {headCells.map(headCell => <HeadTableCell key={headCell.id} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false}>
                          <TableSortLabel active={orderBy === headCell.id} onClick={e => handleRequestSort(e, headCell.id)} direction={orderBy === headCell.id ? order : 'asc'}>
                            {headCell.label}
                          </TableSortLabel>
                        </HeadTableCell>)}
                    </TableRow>
                  </TableHead>

                  {/* TABLE BODY AND DATA */}
                  <TableBody>
                    {paginatedUsers.length === 0 ? <TableDataNotFound /> : paginatedUsers.map(user => <UserTableRowTwo user={user} key={user.id} isSelected={selectedUser?.id === user.id} handleSelectUser={() => setSelectedUser(user)} />)}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* TABLE PAGINATION SECTION */}
            <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredUsers.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} />
          </Card>
        </Grid>

        {/* USER DETAILS INFO */}
        <Grid size={{
        lg: 3,
        md: 4,
        xs: 12
      }}>
          <UserDetails user={selectedUser} />
        </Grid>
      </Grid>
    </div>;
}