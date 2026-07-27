import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// CUSTOM ICON COMPONENTS
import Chat from '@/icons/Chat';
import Email from '@/icons/Email';
import UserBigIcon from '@/icons/UserBigIcon';
// CUSTOM DATA TYPES

// STYLED COMPONENTS
const StyledRoot = styled('div')(({
  theme
}) => ({
  padding: '1.5rem',
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  '.icon': {
    fontSize: 16,
    color: theme.palette.grey[500]
  }
}));

// ==============================================================

// ==============================================================

export default function UserGridCard({
  user
}) {
  return <StyledRoot>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar src={user.avatar} variant="rounded" alt={user.name} />

        <div>
          <Typography variant="body2" fontWeight={500}>
            {user.name}
          </Typography>

          <Typography variant="body2" fontSize={12} color="grey.500">
            {user.username}
          </Typography>
        </div>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} mt={2}>
        <Email className="icon" />
        <Typography variant="body2" color="grey.500">
          {user.email}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" mt={1} spacing={1}>
        <UserBigIcon className="icon" />
        <Typography variant="body2" color="grey.500">
          Status: {user.role}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" mt={1} spacing={1}>
        <Chat className="icon" />
        <Typography variant="body2" color="grey.500">
          Posts: 12
        </Typography>
      </Stack>
    </StyledRoot>;
}