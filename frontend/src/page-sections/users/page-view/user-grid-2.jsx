import { useCallback, useMemo, useState } from 'react';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from '../SearchArea';
import UserDetails from '../UserDetails';
import UserGridCardTwo from '../UserGridCardTwo';
// CUSTOM UTILS METHOD
import { paginate } from '@/utils/paginate';
// CUSTOM DUMMY DATA
import { USER_LIST } from '@/__fakeData__/users';
export default function UserGrid2PageView() {
  const [userPerPage] = useState(21);
  const [page, setPage] = useState(1);
  const [users] = useState([...USER_LIST]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState(USER_LIST[1]);
  const handleSelectUser = useCallback(id => {
    const user = users.find(item => item.id === id);
    if (user) {
      setSelectedUser(user);
    }
  }, [users]);
  const isUserSelected = useCallback(id => selectedUser.id === id, [selectedUser]);
  const handleSearchChange = useCallback(e => {
    setSearchValue(e.target.value);
  }, []);
  const handlePageChange = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);
  const filteredUsers = useMemo(() => {
    if (!searchValue) return users;
    return users.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
  }, [users, searchValue]);
  return <div className="pt-2 pb-4">
      <Grid container>
        <Grid size={{
        lg: 9,
        md: 8,
        xs: 12
      }}>
          <Card sx={{
          px: 3,
          height: '100%',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        }}>
            <SearchArea value={searchValue} onChange={handleSearchChange} gridRoute="/dashboard/user-grid-2" listRoute="/dashboard/user-list-2" />

            <Grid container spacing={3}>
              {paginate(page, userPerPage, filteredUsers).map(user => <Grid size={{
              lg: 4,
              sm: 6,
              xs: 12
            }} key={user.id}>
                  <UserGridCardTwo user={user} isSelected={isUserSelected(user.id)} handleSelectUser={() => handleSelectUser(user.id)} />
                </Grid>)}

              <Grid size={12}>
                <Stack alignItems="center" marginY={2}>
                  <Pagination shape="rounded" count={Math.ceil(filteredUsers.length / userPerPage)} onChange={handlePageChange} />
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>

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