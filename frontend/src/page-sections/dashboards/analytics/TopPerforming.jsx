import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
// CUSTOM UTILS METHOD
import { format } from '@/utils/currency';
// STYLED COMPONENTS
import { HeadTableCell, BodyTableCell } from './styles';

// DUMMY DATA LIST
const TOP_PERFORMING = [{
  id: 1,
  page: 'https://onion.com',
  click: 1369,
  views: '50M',
  click2: -165
}, {
  id: 2,
  page: 'https://onion/analytic.com',
  click: 1003,
  views: '28M',
  click2: 528
}, {
  id: 3,
  page: 'https://onion/ecommerce.com',
  click: 1987,
  views: '63M',
  click2: 898
}, {
  id: 4,
  page: 'https://onion/crm.com',
  click: 1462,
  views: '50M',
  click2: -369
}, {
  id: 5,
  page: 'https://onion/finance.com',
  click: 986,
  views: '70M',
  click2: -479
}, {
  id: 6,
  page: 'https://onion/projectm.com',
  click: 1028,
  views: '75M',
  click2: 669
}, {
  id: 7,
  page: 'https://onion/logistics.com',
  click: 369,
  views: '25M',
  click2: 215
}];
export default function TopPerforming() {
  return <Card sx={{
    padding: 3,
    pb: 1
  }}>
      <Box mb={3}>
        <Typography variant="body2" fontSize={18} fontWeight={500}>
          Top performing pages
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Counted in Millions
        </Typography>
      </Box>

      <Scrollbar>
        <Table sx={{
        minWidth: 470
      }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>PAGES</HeadTableCell>
              <HeadTableCell>CLICKS</HeadTableCell>
              <HeadTableCell align="center">VIEWS</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {TOP_PERFORMING.map(item => <TableRow key={item.id}>
                <BodyTableCell>{item.page}</BodyTableCell>

                <BodyTableCell>
                  <Typography variant="body2" fontWeight={500} sx={{
                span: {
                  marginInlineStart: 1,
                  color: item.click2 > 0 ? 'success.main' : 'error.main'
                }
              }}>
                    {format(item.click)}{' '}
                    <span>
                      {item.click2 > 0 && '+'}
                      {item.click2}
                    </span>
                  </Typography>
                </BodyTableCell>

                <BodyTableCell align="center">{item.views}</BodyTableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}