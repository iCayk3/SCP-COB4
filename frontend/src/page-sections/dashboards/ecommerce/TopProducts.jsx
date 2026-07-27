import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Search from '@mui/icons-material/Search';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM UTILS METHODS
import { currency, format } from '@/utils/currency';
// COMMON DASHBOARD RELATED COMPONENT
import { BodyTableCell, HeadTableCell } from '../_common';

// CUSTOM DUMMY DATA SET
const TOP_PRODUCTS = [{
  id: 'TyN4ZlfvtKi4TtRt-noYS',
  price: 1799,
  sales: 17689,
  totalSold: 2389,
  title: 'Apple Watch',
  image: '/static/products/apple-watch.png'
}, {
  id: 'vNG1Bht1ft6CvPErBIdnO',
  price: 739,
  sales: 62397,
  totalSold: 6698,
  title: 'Nike Shoes',
  image: '/static/products/shoe-1.png'
}, {
  id: '02lb4wDfDMc7QMOMtKv4D',
  price: 245,
  sales: 7658,
  totalSold: 300,
  title: 'Ribbon Glass',
  image: '/static/products/sunglass.png'
}, {
  id: 'uYWC094hZK1i0cTl1RWDP',
  price: 139,
  sales: 6658,
  totalSold: 2389,
  title: 'Apple Watch',
  image: '/static/products/headset.png'
}];
export default function TopProducts() {
  return <Card>
      <FlexBetween p={3}>
        <Typography variant="h6">Top Products</Typography>

        <TextField placeholder="Search products..." slotProps={{
        input: {
          startAdornment: <Search />
        }
      }} />
      </FlexBetween>

      <Scrollbar>
        <Table sx={{
        minWidth: 500
      }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>PRODUCT NAME</HeadTableCell>
              <HeadTableCell>PRICE</HeadTableCell>
              <HeadTableCell align="center">SOLD</HeadTableCell>
              <HeadTableCell align="center">SALES</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {TOP_PRODUCTS.map(item => <TableRow key={item.id}>
                <BodyTableCell>
                  <FlexBox gap={1}>
                    <Avatar variant="rounded" src={item.image} />

                    <div>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {item.title}
                      </Typography>

                      <Typography variant="caption">#{item.id.substring(0, 6)}</Typography>
                    </div>
                  </FlexBox>
                </BodyTableCell>

                <BodyTableCell>{currency(item.price)}</BodyTableCell>
                <BodyTableCell align="center">{format(item.totalSold)} pcs</BodyTableCell>

                <BodyTableCell align="center">
                  <Typography variant="body2" color="text.primary" fontWeight={500}>
                    {currency(item.sales)}
                  </Typography>
                </BodyTableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}