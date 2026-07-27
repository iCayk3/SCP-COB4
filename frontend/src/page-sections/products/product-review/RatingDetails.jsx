import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { formatK } from '@/utils/currency';

// ==========================================================================================

// ==========================================================================================

export default function RatingDetails({
  title,
  progressValue,
  totalReview
}) {
  return <FlexBetween>
      <Typography variant="body2" fontWeight={500} lineHeight={1}>
        {title}
      </Typography>

      <LinearProgress color="success" variant="determinate" value={progressValue} sx={{
      mx: 2
    }} />

      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {formatK(totalReview, 'decimal')}
      </Typography>
    </FlexBetween>;
}