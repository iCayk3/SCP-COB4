import { useNavigate } from 'react-router';
// MUI
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import GroupSenior from '@/icons/GroupSenior';
import Add from '@/icons/Add';

// STYLED COMPONENT
const TabListWrapper = styled(TabList)(({
  theme
}) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
}));
const StyledAvatar = styled(Avatar)(({
  theme
}) => ({
  width: 36,
  height: 36,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '.icon': {
    fontSize: 22,
    color: theme.palette.primary.main
  }
}));

// ===================================================================

// ===================================================================

export default function HeadingArea({
  value,
  changeTab
}) {
  const navigate = useNavigate();
  return <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center" gap={1.5}>
        <StyledAvatar variant="rounded">
          <GroupSenior className="icon" />
        </StyledAvatar>

        <Typography variant="body1" fontWeight={500}>
          Users
        </Typography>
      </FlexBox>

      <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={changeTab}>
          <Tab disableRipple label="All Users" value="" />
          <Tab disableRipple label="Editor" value="editor" />
          <Tab disableRipple label="Contributor" value="contributor" />
          <Tab disableRipple label="Administrator" value="administrator" />
          <Tab disableRipple label="Subscriber" value="subscriber" />
        </TabListWrapper>
      </TabContext>

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/dashboard/add-user')}>
        Add New User
      </Button>
    </FlexBetween>;
}