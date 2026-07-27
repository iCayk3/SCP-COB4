import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
// CUSTOM COMPONENTS
import { Percentage } from '@/components/percentage';
import { FlexBox } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { format } from '@/utils/currency';
const USERS = ['/static/user/user-11.png', '/static/user/user-10.png', '/static/user/user-13.png', '/static/user/user-14.png', '/static/user/user-15.png'];
export default function DailyVisitors() {
  return <Card className="p-3">
      <div>
        <FlexBox alignItems="center" gap={1} mb={1}>
          <Typography variant="h5">{format(1352)}</Typography>
          <Percentage type="primary">+12.5%</Percentage>
        </FlexBox>

        <Typography variant="body2" color="text.secondary">
          Daily Visitors
        </Typography>
      </div>

      <Box mt={7}>
        <Typography variant="body2" mb={0.5} fontWeight={500}>
          Top Visitors
        </Typography>

        <AvatarGroup max={4}>
          {USERS.map((user, index) => <Avatar alt="Remy Sharp" src={user} key={index} />)}
        </AvatarGroup>
      </Box>
    </Card>;
}