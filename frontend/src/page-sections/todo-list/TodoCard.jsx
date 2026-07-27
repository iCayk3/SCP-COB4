import { Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns/format';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import LinearProgress from '@mui/material/LinearProgress';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '@/components/flexbox';

// ==============================================================

// ==============================================================

export default function TodoCard({
  index,
  todo
}) {
  const {
    id,
    date,
    title,
    statusColor
  } = todo;
  return <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{
      cursor: 'grab',
      padding: '1rem',
      marginBottom: '1.5rem',
      '&:hover': {
        boxShadow: 2
      },
      boxShadow: snapshot.isDragging ? 2 : 'none'
    }}>
          <FlexBetween>
            <Typography variant="body2" fontWeight={500}>
              {format(new Date(date), 'MMM dd, yyyy')}
            </Typography>

            <IconButton sx={{
          backgroundColor: 'action.selected'
        }}>
              <MoreHoriz sx={{
            fontSize: 16
          }} />
            </IconButton>
          </FlexBetween>

          <Box textAlign="center" pt={6} pb={4}>
            <Typography variant="body1" fontWeight={500}>
              {title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Prototyping
            </Typography>
          </Box>

          <FlexBetween py={1}>
            <Typography variant="body2" fontWeight={500}>
              Project Progress
            </Typography>

            <Typography variant="body2" fontWeight={500}>
              32%
            </Typography>
          </FlexBetween>

          <LinearProgress value={32} variant="determinate" sx={{
        '& .MuiLinearProgress-bar': {
          backgroundColor: statusColor
        }
      }} />

          <FlexBetween pt="1.5rem">
            <FlexBox alignItems="center" gap={1}>
              <AvatarGroup max={3}>
                <Avatar alt="Remy" src="/static/user/user-11.png" />
                <Avatar alt="Travis" src="/static/user/user-11.png" />
                <Avatar alt="Travis" src="/static/user/user-11.png" />
                <Avatar alt="Travis" src="/static/user/user-11.png" />
              </AvatarGroup>
            </FlexBox>

            <Chip label="3 Weeks Left" color="secondary" />
          </FlexBetween>
        </Card>}
    </Draggable>;
}