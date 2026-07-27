import { useCallback, useEffect, useMemo, useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { TableDataNotFound, TableToolbar } from '@/components/table';
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from '../SearchArea';
import HeadingArea from '../HeadingArea';
import UserTableRow from '../UserTableRow';
import UserTableHead from '../UserTableHead';
// CUSTOM DEFINED HOOK
import { useMuiTable, getComparator, stableSort } from '@/hooks/useMuiTable';
// CUSTOM DUMMY DATA
import { USER_LIST } from '@/__fakeData__/users';
export default function UserList1PageView() {
  const [users, setUsers] = useState([...USER_LIST]);
  const [userFilter, setUserFilter] = useState({
    role: '',
    search: ''
  });
  const {
    page,
    order,
    orderBy,
    selected,
    isSelected,
    rowsPerPage,
    setPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage
  } = useMuiTable({
    defaultOrderBy: 'name'
  });
  useEffect(() => {
    setPage(0);
  }, [userFilter, setPage]);
  const handleChangeFilter = useCallback((key, value) => {
    setUserFilter(prevFilter => ({
      ...prevFilter,
      [key]: value
    }));
  }, []);
  const handleChangeTab = useCallback((_, newValue) => {
    handleChangeFilter('role', newValue);
  }, [handleChangeFilter]);
  const handleSearchChange = useCallback(e => {
    handleChangeFilter('search', e.target.value);
  }, [handleChangeFilter]);
  const handleDeleteUser = useCallback(id => {
    setUsers(prevUsers => prevUsers.filter(item => item.id !== id));
  }, []);
  const handleAllUserDelete = useCallback(() => {
    setUsers(prevUsers => prevUsers.filter(item => !selected.includes(item.id)));
    handleSelectAllRows([])();
  }, [selected, handleSelectAllRows]);
  const filteredUsers = useMemo(() => {
    const sortedUsers = stableSort(users, getComparator(order, orderBy));
    return sortedUsers.filter(item => {
      if (userFilter.role) {
        return item.role.toLowerCase() === userFilter.role.toLowerCase();
      } else if (userFilter.search) {
        return item.name.toLowerCase().includes(userFilter.search.toLowerCase());
      }
      return true;
    });
  }, [users, order, orderBy, userFilter.role, userFilter.search]);
  const paginatedUsers = useMemo(() => filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [filteredUsers, page, rowsPerPage]);
  const allUserIds = useMemo(() => filteredUsers.map(row => row.id), [filteredUsers]);
  return <div className="pt-2 pb-4">
      <Card>
        <Box px={2} pt={2}>
          <HeadingArea value={userFilter.role} changeTab={handleChangeTab} />

          <SearchArea value={userFilter.search} onChange={handleSearchChange} gridRoute="/dashboard/user-grid" listRoute="/dashboard/user-list" />
        </Box>

        {/* TABLE ROW SELECTION HEADER  */}
        {selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllUserDelete} />}

        {/* TABLE HEAD & BODY ROWS */}
        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <UserTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredUsers.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(allUserIds)} />

              <TableBody>
                {paginatedUsers.length === 0 ? <TableDataNotFound /> : paginatedUsers.map(user => <UserTableRow key={user.id} user={user} isSelected={isSelected(user.id)} handleSelectRow={handleSelectRow} handleDeleteUser={handleDeleteUser} />)}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {/* PAGINATION SECTION */}
        <Box padding={1}>
          <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredUsers.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} showFirstButton showLastButton />
        </Box>
      </Card>
    </div>;
}