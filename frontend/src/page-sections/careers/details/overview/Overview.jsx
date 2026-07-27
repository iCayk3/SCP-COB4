import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENTS
import AttachMoney from '@mui/icons-material/AttachMoney';
import RoomOutlined from '@mui/icons-material/RoomOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
// CUSTOM COMPONENTS
import Item from './Item';
export default function Overview() {
  return <Card sx={{
    top: 20,
    width: '100%',
    padding: '1.5rem',
    position: 'sticky'
  }}>
      <Typography variant="h6">Job Overview</Typography>

      <Stack spacing={2} mt={3}>
        <Item Icon={CalendarMonthOutlined} title="Date Posted" description="2 days ago" />
        <Item Icon={AccessTimeOutlined} title="Expiration date" description="August 30, 2023" />
        <Item Icon={RoomOutlined} title="Location" description="Subidbazar, Sylhet, Bangladesh" />
        <Item Icon={PersonOutlined} title="Job Title" description="UI and UX Designer" />
        <Item Icon={AttachMoney} title="Rate" description="$21 - $40 / hour" />
      </Stack>
    </Card>;
}