import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { FlexBetween, FlexBox } from '@/components/flexbox';
// COMMON STYLED COMPONENTS
import { HeadTableCell, BodyTableCell, BodyTableRow } from '../styles';
// CUSTOM DUMMY DATA SET
import { ACTIVITY_LIST, HEAD_CELLS } from './data';
export default function RecentDevices() {
  return <Card sx={{
    pb: 1
  }}>
      <FlexBetween padding={3} flexWrap="wrap">
        <Typography variant="body1" fontWeight={500}>
          Recent Devices
        </Typography>

        <Typography variant="caption">
          View and manage devices where you're currently logged in.
        </Typography>
      </FlexBetween>

      <Scrollbar autoHide={false}>
        <Table sx={{
        minWidth: 800
      }}>
          <TableHead>
            <TableRow>
              {HEAD_CELLS.map(item => <HeadTableCell key={item}>{item}</HeadTableCell>)}
            </TableRow>
          </TableHead>

          <TableBody>
            {ACTIVITY_LIST.map(item => <BodyTableRow key={item.id}>
                <BodyTableCell>
                  <FlexBox alignItems="center" gap={1}>
                    <Avatar src={item.browserIcon} sx={{
                  width: 20,
                  height: 20
                }} />
                    <Typography variant="body2">{item.browser}</Typography>
                  </FlexBox>
                </BodyTableCell>

                <BodyTableCell>{item.device}</BodyTableCell>

                <BodyTableCell>
                  <FlexBox gap={1} alignItems="center">
                    <Typography variant="body2">{item.location}</Typography>
                    {item.current && <Chip label="current" size="small" color="success" variant="outlined" />}
                  </FlexBox>
                </BodyTableCell>

                <BodyTableCell>{item.recentActivity}</BodyTableCell>
              </BodyTableRow>)}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}