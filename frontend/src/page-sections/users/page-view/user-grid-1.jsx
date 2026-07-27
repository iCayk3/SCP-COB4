import { useCallback, useState } from 'react';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
// CUSTOM COMPONENTS
import SearchArea from '../SearchArea';
import HeadingArea from '../HeadingArea';
import UserGridCard from '../UserGridCard';
// CUSTOM UTILS METHOD
import { paginate } from '@/utils/paginate';
// CUSTOM DUMMY DATA
import { USER_LIST } from '@/__fakeData__/users';
export default function UserGrid1PageView() {
  const [userPerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [users] = useState([...USER_LIST]);
  const [userFilter, setUserFilter] = useState({
    role: '',
    search: ''
  });
  const handleChangeFilter = (key, value) => {
    setUserFilter(state => ({
      ...state,
      [key]: value
    }));
  };
  const handleSearchChange = useCallback(e => {
    handleChangeFilter('search', e.target.value);
  }, [handleChangeFilter]);
  const changeTab = useCallback((_, newValue) => {
    handleChangeFilter('role', newValue);
  }, [handleChangeFilter]);
  const filteredUsers = users.filter(item => {
    if (userFilter.role) {
      return item.role.toLowerCase() === userFilter.role;
    } else if (userFilter.search) {
      return item.name.toLowerCase().includes(userFilter.search.toLowerCase());
    }
    return true;
  });
  return <div className="pt-2 pb-4">
      <Card sx={{
      px: 3,
      py: 2
    }}>
        <HeadingArea value={userFilter.role} changeTab={changeTab} />

        <SearchArea value={userFilter.search} onChange={handleSearchChange} gridRoute="/dashboard/user-grid" listRoute="/dashboard/user-list" />

        <Grid container spacing={3}>
          {paginate(page, userPerPage, filteredUsers).map(user => <Grid size={{
          lg: 3,
          md: 4,
          sm: 6,
          xs: 12
        }} key={user.id}>
              <UserGridCard user={user} />
            </Grid>)}

          <Grid size={12}>
            <Stack alignItems="center" py={2}>
              <Pagination shape="rounded" count={Math.ceil(filteredUsers.length / userPerPage)} onChange={(_, newPage) => setPage(newPage)} />
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </div>;
}