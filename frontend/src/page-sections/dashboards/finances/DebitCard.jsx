import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// MUI ICON COMPONENTS
import Add from '@mui/icons-material/Add';
import MoreVert from '@mui/icons-material/MoreVert';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
const RECEIVERS = ['/static/user/user-11.png', '/static/user/user-10.png', '/static/user/user-9.png', '/static/user/user-8.png', '/static/user/avatar.png'];
export default function DebitCard() {
  return <Card sx={{
    p: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
      <FlexBetween mb={2}>
        <Typography variant="h6">Your Card</Typography>

        <IconButton size="small">
          <MoreVert fontSize="small" sx={{
          color: 'grey.300'
        }} />
        </IconButton>
      </FlexBetween>

      <Box component="img" src="/static/debit-card.png" alt="debit-card" width="100%" />

      <FlexBetween mt={2} flexWrap="wrap">
        <Typography variant="caption" fontWeight={500}>
          Receivers:
        </Typography>

        {RECEIVERS.map((image, index) => <Avatar key={index} src={image} alt="Receiver" variant="bordered" sx={{
        width: 35,
        height: 35
      }} />)}

        <IconButton size="small" sx={{
        flexShrink: 0,
        border: '1px dashed',
        borderColor: 'divider'
      }}>
          <Add />
        </IconButton>
      </FlexBetween>
    </Card>;
}