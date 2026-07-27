import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Create from '@mui/icons-material/Create';
import ListItem from './list-item';
import { LABELS, LIST_ITEMS } from './data';
export default function MailSidebar({
  openSidebar,
  onClose
}) {
  const navigate = useNavigate();
  const {
    pathname
  } = useLocation();
  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));
  const handleNavigate = useCallback(url => () => navigate(url), [navigate]);

  // SIDEBAR NAVIGATION CONTENT
  const CONTENT = <>
      <Button fullWidth startIcon={<Create />} onClick={handleNavigate('/dashboard/mail/compose')}>
        Compose
      </Button>

      <Box display="flex" flexDirection="column" mt={4}>
        {LIST_ITEMS.map(({
        Icon,
        id,
        title,
        value,
        url
      }) => <ListItem key={id} title={title} value={value} active={url === pathname} handleChange={handleNavigate(url)} Icon={<Icon sx={{
        fontSize: 17
      }} />} />)}
      </Box>

      <Typography variant="body2" sx={{
      fontWeight: 600,
      mt: 4,
      mb: 1
    }}>
        Labels
      </Typography>

      <Box display="flex" flexDirection="column">
        {LABELS.map(({
        id,
        title,
        value,
        color
      }) => <ListItem key={id} title={title} value={value} active={false} handleChange={() => {}} Icon={<Box sx={{
        mr: 1,
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: color
      }} />} />)}
      </Box>
    </>;

  // FOR SMALLER DEVICES
  if (downMd) {
    return <Drawer anchor="left" onClose={onClose} open={openSidebar} slotProps={{
      paper: {
        sx: {
          p: 3,
          width: 280
        }
      }
    }}>
        {CONTENT}
      </Drawer>;
  }
  return <Box p={3} width={260} flexShrink={0} borderRight="1px solid" borderColor="divider">
      {CONTENT}
    </Box>;
}