import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
// CUSTOM COMPONENTS
import { Percentage } from '@/components/percentage';
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { format } from '@/utils/currency';
export default function Order() {
  return <Card sx={{
    padding: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
      <div>
        <FlexBox alignItems="center" gap={1} mb={1}>
          <Typography variant="h5">{format(1352)}</Typography>
          <Percentage type="error">-2.2%</Percentage>
        </FlexBox>

        <Typography variant="body2" color="text.secondary">
          Order This Month
        </Typography>
      </div>

      <Box mt={7}>
        <FlexBetween mb={1}>
          <Typography variant="body2" fontWeight={600}>
            1,500 to Goal
          </Typography>

          <Typography variant="body2" color="text.secondary">
            75%
          </Typography>
        </FlexBetween>

        <LinearProgress value={60} color="success" variant="determinate" sx={{
        height: 8
      }} />
      </Box>
    </Card>;
}