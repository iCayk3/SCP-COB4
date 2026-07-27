import { useCallback, useState } from 'react';
// MUI
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import PopoverLayout from './_PopoverLayout';
// CUSTOM ICON COMPONENT
import NotificationsIcon from '@/icons/NotificationsIcon';
// DUMMY DATA SET
import { ARCHIVES, MESSAGES } from '@/data/notifications';

// STYLED COMPONENTS
const StyledTab = styled(Tab)({
  flex: 1,
  marginLeft: 0,
  marginRight: 0
});
const ListItemWrapper = styled('div', {
  shouldForwardProp: prop => prop !== 'isNew'
})(({
  theme,
  isNew
}) => ({
  padding: '1rem',
  gap: '1rem',
  borderBottom: 1,
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  borderColor: 'divider',
  backgroundColor: isNew ? theme.palette.action.hover : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  '.dot': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: isNew ? theme.palette.primary.main : theme.palette.grey[400]
  },
  '.thumbnail': {
    gap: '1rem',
    display: 'flex',
    alignItems: 'center'
  }
}));
export default function NotificationsPopover() {
  const [tabValue, setTabValue] = useState('1');
  const handleTabChange = useCallback((_, value) => setTabValue(value), []);

  // UNREAD MESSAGES LENGTH
  const UNREAD_MSG_LEN = MESSAGES.filter(item => item.type === 'new_message').length;
  const RENDER_CONTENT = () => {
    return <TabContext value={tabValue}>
        <TabList onChange={handleTabChange}>
          <StyledTab value="1" label={`Messages (${UNREAD_MSG_LEN})`} />
          <StyledTab value="2" label="Archived" />
        </TabList>

        {MESSAGES.length === 0 ? <Typography variant="body2" fontWeight="500" textAlign="center" p={2}>
            There are no notifications
          </Typography> : <TabPanel value="1">
            {MESSAGES.map(msg => <ListItem key={msg.id} type={msg.type} name={msg.name} image={msg.image} message={msg.message} />)}
          </TabPanel>}

        {ARCHIVES.length === 0 ? <Typography variant="body2" fontWeight="500" textAlign="center" p={2}>
            There are no archives
          </Typography> : <TabPanel value="2">
            {ARCHIVES.map(msg => <ListItem key={msg.id} type={msg.type} name={msg.name} image={msg.image} message={msg.message} />)}
          </TabPanel>}
      </TabContext>;
  };
  const SELECT_BUTTON = <Badge color="error" badgeContent={0}>
      <NotificationsIcon sx={{
      color: 'grey.400'
    }} />
    </Badge>;
  return <PopoverLayout title="Notifications" renderContent={RENDER_CONTENT} selectButton={SELECT_BUTTON} />;
}

// ==============================================================

function ListItem({
  image,
  name,
  message,
  type
}) {
  const isNew = type === 'new_message';
  return <ListItemWrapper isNew={isNew}>
      <div className="thumbnail">
        <div className="dot" />
        <Avatar src={image} alt={name} sx={{
        width: 35,
        height: 35
      }} />
      </div>

      <div>
        <Typography variant="body2" fontWeight={500}>
          {name}
        </Typography>

        <Typography variant="body2" noWrap fontSize={12} color="text.secondary">
          {message}
        </Typography>
      </div>
    </ListItemWrapper>;
}