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
const SHIPMENTS = [{
  id: 'uZmSymBK_PJa9LQjcXYa4',
  status: 'Delivered',
  status_type: 'success',
  title: 'Apple Watch',
  address: 'Rome, Italy.',
  image: '/static/products/apple-watch.png',
  user: {
    name: 'Astole Banne',
    balance: 560
  }
}, {
  id: 'OUPcgj2Kxvgu1hDYQ72W-',
  status: 'Shipping',
  status_type: 'primary',
  title: 'Nike Shoes',
  address: 'Bangkok, Singapore',
  image: '/static/products/shoe-1.png',
  user: {
    name: 'Talon Abela',
    balance: 250.5
  }
}, {
  id: 'YXwromkWBoJSTg6RWnhIq',
  status: 'Delayed',
  status_type: 'error',
  title: 'Ribbon Glass',
  address: 'Paris, France',
  image: '/static/products/sunglass.png',
  user: {
    name: 'Tofan Andy',
    balance: 150.25
  }
}, {
  id: 'P60lQe4RezuqP-mxA0bXY',
  status: 'Delivered',
  status_type: 'success',
  title: 'Apple Watch',
  address: 'New York, USA',
  image: '/static/products/headset.png',
  user: {
    name: 'Jhon Ables',
    balance: 799.25
  }
}];
export default function ShipmentHistory() {
  return <Card>
      <div className="p-3">
        <Typography variant="h6">Shipment History</Typography>

        <Typography variant="body2" fontSize={13} color="text.secondary">
          50+ Active Shipments
        </Typography>
      </div>

      <Scrollbar>
        <Table sx={{
        minWidth: 600
      }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>NAME & ID</HeadTableCell>
              <HeadTableCell>CLIENTS NAME</HeadTableCell>
              <HeadTableCell align="center">ADDRESS</HeadTableCell>
              <HeadTableCell align="center">STATUS</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {SHIPMENTS.map(item => <TableRow key={item.id}>
                <BodyTableCell>
                  <FlexBox gap={2}>
                    <Avatar src={item.image} alt={item.title} />

                    <div>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {item.title}
                      </Typography>

                      <Typography variant="caption">#{item.id.substring(0, 10)}</Typography>
                    </div>
                  </FlexBox>
                </BodyTableCell>

                <BodyTableCell>
                  <Typography variant="body2" fontWeight={500} color="text.primary">
                    {item.user.name}
                  </Typography>

                  <Typography variant="caption">{currency(item.user.balance)}</Typography>
                </BodyTableCell>

                <BodyTableCell align="center">{item.address}</BodyTableCell>

                <BodyTableCell align="center">
                  <StatusBadge type={item.status_type}>{item.status}</StatusBadge>
                </BodyTableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}