import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { FlexBox } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { format } from '@/utils/currency';
// STYLED COMPONENTS
import { BodyTableCell, HeadTableCell } from './styles';

// DUMMY DATA LIST
const TOP_QUERIES = [{
  id: 1,
  keyword: 'Admin Dashboard',
  click: 1369,
  value: 90
}, {
  id: 2,
  keyword: 'Top Admin Dashboard',
  click: 1003,
  value: 80
}, {
  id: 3,
  keyword: 'Admin Panel',
  click: 1987,
  value: 95
}, {
  id: 4,
  keyword: 'Analytics Dashboard',
  click: 1462,
  value: 85
}, {
  id: 5,
  keyword: 'Minimal Dashboard',
  click: 986,
  value: 75
}, {
  id: 6,
  keyword: 'Clean UI Template',
  click: 1028,
  value: 90
}, {
  id: 7,
  keyword: 'Logistics Dashboard',
  click: 369,
  value: 87
}];
export default function TopQueries() {
  return <Card sx={{
    padding: 3,
    pb: 1
  }}>
      <Box mb={3}>
        <Typography variant="body2" fontSize={18} fontWeight={500}>
          Top Queries
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
              <HeadTableCell>KEYWORDS</HeadTableCell>
              <HeadTableCell align="right">CLICKS</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {TOP_QUERIES.map(item => <TableRow key={item.id}>
                <BodyTableCell sx={{
              color: 'grey.500'
            }}>{item.keyword}</BodyTableCell>

                <BodyTableCell>
                  <FlexBox alignItems="center" gap={2} minWidth={100}>
                    <LinearProgress value={item.value} variant="determinate" />

                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {format(item.click)}
                    </Typography>
                  </FlexBox>
                </BodyTableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}