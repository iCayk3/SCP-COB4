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
import { StatusBadge } from '@/components/status-badge';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
// COMMON DASHBOARD RELATED COMPONENTS
import { BodyTableCell, HeadTableCell } from '../_common';

// CUSTOM DUMMY DATA
const DEALS = [{
  id: 'kpjjcgmL2Ubr9zvI5-3oc',
  dealValue: 203500,
  status: 'Deal won',
  status_type: 'success',
  company: 'Absternet LLC',
  user: {
    name: 'Astole Banne',
    designation: 'Sales Manager',
    image: '/static/user/user-11.png'
  }
}, {
  id: 'g176jyX0oyIBZBLhHY34X',
  dealValue: 283500,
  status: 'Stuck',
  status_type: 'error',
  company: 'Nike',
  user: {
    name: 'Lisa Bee',
    designation: 'Sales Manager',
    image: '/static/user/user-11.png'
  }
}, {
  id: 'Qf2Gi4KeQ0eCzoZNCoPoF',
  dealValue: 243500,
  status: 'Pending',
  status_type: 'warning',
  company: 'Absternet LLC',
  user: {
    name: 'Stuward Canne',
    designation: 'Sales Manager',
    image: '/static/user/user-11.png'
  }
}];
export default function DealStatus() {
  return <Card className="h-full">
      <Typography variant="h6" sx={{
      p: 3
    }}>
        Deal Status
      </Typography>

      <Scrollbar>
        <Table sx={{
        minWidth: 600
      }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>Sales Representative</HeadTableCell>
              <HeadTableCell>Company Name</HeadTableCell>
              <HeadTableCell>Status</HeadTableCell>
              <HeadTableCell>Deal Value</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {DEALS.map(({
            id,
            dealValue,
            company,
            status,
            user,
            status_type
          }) => <TableRow key={id}>
                <BodyTableCell>
                  <FlexBox gap={2}>
                    <Avatar src={user.image} />

                    <div>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {user.name}
                      </Typography>

                      <Typography variant="caption">{user.designation}</Typography>
                    </div>
                  </FlexBox>
                </BodyTableCell>

                <BodyTableCell>
                  <Typography variant="body2" color="text.primary" fontWeight={500}>
                    {company}
                  </Typography>
                </BodyTableCell>

                <BodyTableCell>
                  <StatusBadge type={status_type}>{status}</StatusBadge>
                </BodyTableCell>

                <BodyTableCell>{currency(dealValue)}</BodyTableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}