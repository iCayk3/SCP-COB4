import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';
// MUI ICON COMPONENT
import MoreHoriz from '@mui/icons-material/MoreHoriz';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';

// ====================================================================

// ====================================================================

export default function CampaignCard({
  Icon,
  title,
  color,
  amount,
  impression,
  progressValue
}) {
  return <Card className="p-3">
      <FlexBetween>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar variant="rounded" sx={{
          width: 30,
          height: 30,
          backgroundColor: alpha(color, 0.1)
        }}>
            <Icon sx={{
            fontSize: 18,
            color
          }} />
          </Avatar>

          <Typography variant="body2" fontWeight={500} color="text.secondary">
            {title}
          </Typography>
        </Stack>

        <IconButton size="small">
          <MoreHoriz fontSize="small" color="action" />
        </IconButton>
      </FlexBetween>

      <FlexBetween flexWrap="wrap" gap={0.5} my={2}>
        <Typography variant="h6" fontWeight={600}>
          {currency(amount)}
        </Typography>

        <FlexBox alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight={600} color={impression > 0 ? 'success.main' : 'error.main'}>
            {impression}%
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Subscriber growth
          </Typography>
        </FlexBox>
      </FlexBetween>

      <Stack direction="row" alignItems="center" spacing={2}>
        <LinearProgress value={progressValue} variant="determinate" sx={{
        '& .MuiLinearProgress-bar': {
          backgroundColor: color
        }
      }} />

        <Typography variant="body2" fontWeight={500}>
          {progressValue}%
        </Typography>
      </Stack>
    </Card>;
}