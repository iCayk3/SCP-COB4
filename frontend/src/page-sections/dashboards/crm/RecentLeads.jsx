import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { Scrollbar } from '@/components/scrollbar';
import { MoreButton } from '@/components/more-button';
import { StatusBadge } from '@/components/status-badge';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
// COMMON DASHBOARD RELATED COMPONENTS
import { BodyTableCell, HeadTableCell } from '../_common';

// CUSTOM DUMMY DATA SET
const DATA = [{
  id: 've2PUJLYevjYKcxOjOhKi',
  status: 'Won Lead',
  status_type: 'success',
  email: 'astole@gmail.com',
  user: {
    name: 'Astole Banne',
    balance: 25360,
    image: '/static/user/user-11.png'
  }
}, {
  id: 'lPj1gfpCMbjilNjVyc4KR',
  status: 'Cold Lead',
  status_type: 'warning',
  email: 'taslon@gmail.com',
  user: {
    name: 'Taslon Abela',
    balance: 25360,
    image: '/static/user/user-17.png'
  }
}, {
  id: 'XaZF61T5OWBvQzk8FAUUk',
  status: 'New Lead',
  status_type: 'error',
  email: 'tofan@gmail.com',
  user: {
    name: 'Tofan Andy',
    balance: 25360,
    image: '/static/user/user-18.png'
  }
}];
export default function RecentLeads() {
  return <Card className="h-full">
      <Typography variant="h6" sx={{
      p: 3
    }}>
        Recent Leads
      </Typography>

      <Scrollbar>
        <Table sx={{
        minWidth: 600
      }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>NAME</HeadTableCell>
              <HeadTableCell>EMAIL OR PHONE</HeadTableCell>
              <HeadTableCell>STATUS</HeadTableCell>
              <HeadTableCell>ACTION</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {DATA.map(({
            id,
            status,
            user,
            email,
            status_type
          }) => <TableRow key={id}>
                <BodyTableCell>
                  <FlexBox gap={1}>
                    <Avatar src={user.image} />

                    <div>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {user.name}
                      </Typography>

                      <Typography variant="caption">{currency(user.balance)}</Typography>
                    </div>
                  </FlexBox>
                </BodyTableCell>

                <BodyTableCell>
                  <Typography variant="body2" color="text.primary" fontWeight={500}>
                    {email}
                  </Typography>
                </BodyTableCell>

                <BodyTableCell>
                  <StatusBadge type={status_type}>{status}</StatusBadge>
                </BodyTableCell>

                <BodyTableCell>
                  <MoreButton size="small" />
                </BodyTableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}