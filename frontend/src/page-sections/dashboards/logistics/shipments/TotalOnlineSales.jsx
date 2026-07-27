import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
// CUSTOM COMPONENTS
import Heading from './Heading';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM UTILS METHODS
import { currency, formatK } from '@/utils/currency';
// STYLED COMPONENTS
import { CardWrapper } from './styles';
export default function TotalOnlineSales() {
  return <CardWrapper>
      <Heading percentage="+4.67%" title={currency(50000)} subtitle="Total Online Sales" />

      <Box mt={4}>
        <FlexBetween mb={1}>
          <Typography variant="caption" fontWeight={600}>
            {formatK(100000)} to Goal
          </Typography>

          <Typography variant="caption" color="text.secondary">
            75%
          </Typography>
        </FlexBetween>

        <LinearProgress value={60} color="primary" variant="determinate" sx={{
        height: 8
      }} />
      </Box>
    </CardWrapper>;
}