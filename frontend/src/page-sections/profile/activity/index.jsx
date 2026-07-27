import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Timeline from '@mui/lab/Timeline';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { Scrollbar } from '@/components/scrollbar';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM SECTION COMPONENTS
import PinItem from './PinItem';
import ChatItem from './chat-item';
import EditItem from './edit-item';
import FileItem from './file-item';
import LayerItem from './LayerItem';
export default function Activity() {
  return <Card>
      <FlexBetween flexWrap="wrap" p={3}>
        <Typography variant="body1" fontWeight={500}>
          My Activity
        </Typography>

        <Select defaultValue="today" size="small">
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </Select>
      </FlexBetween>

      <Divider />

      <Box my={2}>
        <Scrollbar autoHide={false}>
          <Timeline>
            <ChatItem />
            <PinItem />
            <FileItem />
            <LayerItem />
            <EditItem />
          </Timeline>
        </Scrollbar>
      </Box>
    </Card>;
}