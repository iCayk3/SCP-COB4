import { useMemo } from 'react';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import LinearProgress from '@mui/material/LinearProgress';
import { styled, alpha, useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';

// STYLED COMPONENTS
const StyledAvatarGroup = styled(AvatarGroup, {
  shouldForwardProp: prop => prop !== 'type'
})(({
  type
}) => ({
  '& .MuiAvatar-root': {
    width: 30,
    height: 30
  },
  '& .MuiAvatar-colorDefault': {
    color: type,
    fontWeight: 500,
    backgroundColor: alpha(type, 0.1)
  }
}));

// =======================================================================

// =======================================================================

export default function ProjectCard({
  due,
  Icon,
  users,
  title,
  value,
  status,
  description
}) {
  const theme = useTheme();
  const color = useMemo(() => {
    if (status === 'Pending') return theme.palette.primary.main;
    if (status === 'Completed') return theme.palette.success.main;
    return theme.palette.warning.main;
  }, [status]);

  // FOR CHIP AND LINEAR PROGRESS
  const getColorType = useMemo(() => {
    if (status === 'Pending') return 'primary';else if (status === 'Completed') return 'success';else return 'warning';
  }, [status]);
  return <Card className="p-3">
      <FlexBetween>
        <Avatar variant="rounded" sx={{
        bgcolor: alpha(color, 0.1)
      }}>
          <Icon sx={{
          color
        }} />
        </Avatar>

        <Chip label={status} size="small" color={getColorType} />
      </FlexBetween>

      <Typography variant="body1" sx={{
      my: 2,
      fontWeight: 500
    }}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>

      <Stack my={2} direction="row" alignItems="center" spacing={2}>
        <LinearProgress value={value} variant="determinate" color={getColorType} />
        <Typography variant="body2" fontWeight={500}>
          {value}%
        </Typography>
      </Stack>

      <FlexBetween>
        <StyledAvatarGroup max={3} type={color}>
          {users.map(user => <Avatar key={user} src={user} alt={title} />)}
        </StyledAvatarGroup>

        <Typography variant="body2" fontWeight={500} color="text.secondary">
          {due}
        </Typography>
      </FlexBetween>
    </Card>;
}