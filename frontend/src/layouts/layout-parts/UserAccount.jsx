import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { AvatarLoading } from '@/components/avatar-loading';
import { FlexRowAlign } from '@/components/flexbox';
export default function UserAccount() {
  return <FlexRowAlign flexDirection="column" py={5}>
      <Badge badgeContent="Free" color="primary">
        <AvatarLoading alt="user" percentage={60} src="/static/user/user-11.png" sx={{
        width: 50,
        height: 50
      }} />
      </Badge>

      <Box textAlign="center" pt={1.5} pb={3}>
        <Chip variant="outlined" label="60% Complete" size="small" />

        <Typography variant="body1" fontWeight={600} sx={{
        mt: 2
      }}>
          Aaron Cooper
        </Typography>

        <Typography variant="body2" fontSize={13} fontWeight={500} color="text.secondary">
          aaron@example.com
        </Typography>
      </Box>

      <Button>Upgrade to Pro</Button>
    </FlexRowAlign>;
}