import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { Scrollbar } from '@/components/scrollbar';
import { StatusBadge } from '@/components/status-badge';
// COMMON DASHBOARD RELATED COMPONENTS
import { BodyTableCell, HeadTableCell } from '../_common';

// CUSTOM DUMMY DATA SET
const CAMPAIGNS = [{
  id: 'cWnbg_X_UHc1vGGbAcucB',
  status: 'Live Now',
  status_type: 'success',
  title: 'Valentine Day',
  createdAt: '14th February, 2022',
  duration: '14 Feb - 21 Feb, 2022',
  image: '/static/thumbnail/6.png',
  users: ['/static/user/user-11.png', '/static/user/user-10.png', '/static/user/user-13.png', '/static/user/user-14.png', '/static/user/user-15.png']
}, {
  id: 'LeHtm1JZCp8TPWqRuaW9-',
  status: 'Reviewing',
  status_type: 'primary',
  title: 'Mother’s Day',
  createdAt: '2nd April, 2022',
  duration: '2 Apr - 5 Apr, 2022',
  image: '/static/thumbnail/5.png',
  users: ['/static/user/user-11.png', '/static/user/user-10.png', '/static/user/user-13.png', '/static/user/user-14.png', '/static/user/user-15.png']
}, {
  id: 'NJMj88ZYLgaTfAVG7kMmZ',
  status: 'Paused',
  status_type: 'warning',
  title: 'Cyber Monday',
  createdAt: '17th January, 2022',
  duration: '17 Jan - 21 Jan, 2022',
  image: '/static/thumbnail/4.png',
  users: ['/static/user/user-11.png', '/static/user/user-10.png', '/static/user/user-13.png', '/static/user/user-14.png', '/static/user/user-15.png']
}, {
  id: 'HcHJMhY5WVurNXCor_rZJ',
  status: 'Live Now',
  status_type: 'success',
  title: 'Valentine Day',
  createdAt: '14th February, 2022',
  duration: '14 Feb - 21 Feb, 2022',
  image: '/static/thumbnail/6.png',
  users: ['/static/user/user-11.png', '/static/user/user-10.png', '/static/user/user-13.png', '/static/user/user-14.png', '/static/user/user-15.png']
}];
export default function AllCampaigns() {
  return <Card>
      <div className="p-3">
        <Typography variant="h6">All Campaigns</Typography>
        <Typography variant="body2" fontSize={13} color="text.secondary">
          20+ Active Campaign
        </Typography>
      </div>

      <Scrollbar>
        <Table sx={{
        minWidth: 600
      }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>NAME</HeadTableCell>
              <HeadTableCell>TEAM MEMBER</HeadTableCell>
              <HeadTableCell align="center">STATUS</HeadTableCell>
              <HeadTableCell align="center">DURATION</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {CAMPAIGNS.map(item => <TableRow key={item.id}>
                <BodyTableCell>
                  <FlexBox gap={2}>
                    <Avatar variant="rounded" src={item.image} alt={item.title} />

                    <div>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {item.title}
                      </Typography>

                      <Typography variant="caption">{item.createdAt}</Typography>
                    </div>
                  </FlexBox>
                </BodyTableCell>

                <BodyTableCell>
                  <AvatarGroup max={4} sx={{
                '& .MuiAvatar-root': {
                  width: 30,
                  height: 30
                }
              }}>
                    {item.users.map((user, index) => <Avatar alt="Remy Sharp" src={user} key={index} />)}
                  </AvatarGroup>
                </BodyTableCell>

                <BodyTableCell align="center">
                  <StatusBadge type={item.status_type}>{item.status}</StatusBadge>
                </BodyTableCell>

                <BodyTableCell align="center">{item.duration}</BodyTableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}