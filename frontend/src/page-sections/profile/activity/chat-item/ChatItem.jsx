import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import ListItem from './ListItem';
import ItemLayout from '../ItemLayout';
// CUSTOM ICON COMPONENT
import Chat from '@/icons/Chat';
export default function ChatItem() {
  return <ItemLayout Icon={<Chat sx={{
    fontSize: 16
  }} />}>
      <Typography variant="body2" fontWeight={600} mb={0.5}>
        There are 2 new tasks for you in Alphp Plus project:
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="caption" color="text.secondary">
          Added at 4.23 PM by
        </Typography>

        <Avatar src="/static/user/user-11.png" sx={{
        width: 16,
        height: 16
      }} />
      </Stack>

      <ListItem title="Meeting with customer" status="In Progress" />
      <ListItem title="Project Delivery" status="Complete" />
    </ItemLayout>;
}