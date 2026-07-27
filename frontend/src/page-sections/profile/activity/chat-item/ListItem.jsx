import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// CUSTOM ICON COMPONENT
import { StyledAvatarGroup, StyledRoot } from './styles';

// ======================================================================

// ======================================================================

export default function ListItem({
  title,
  status
}) {
  return <StyledRoot>
      <Typography variant="body2" fontWeight={500}>
        {title}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Chip label="Application" color="secondary" />

        <StyledAvatarGroup max={4}>
          <Avatar src="/static/user/user-11.png" />
          <Avatar src="/static/user/user-10.png" />
          <Avatar src="/static/user/user-9.png" />
          <Avatar src="/static/user/user-8.png" />
          <Avatar src="/static/user/user-7.png" />
        </StyledAvatarGroup>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
        <Button size="small" color={status === 'Complete' ? 'success' : 'primary'}>
          {status}
        </Button>

        <Button size="small" variant="outlined" color="secondary">
          View
        </Button>
      </Stack>
    </StyledRoot>;
}