import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Duration',
  data: [70, 60, 90, 80, 100, 70, 80]
}];
export default function AvgCallDuration() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    chart: {
      offsetY: 30
    },
    stroke: {
      show: true
    },
    colors: [theme.palette.primary.main, theme.palette.primary[100]],
    xaxis: {
      categories,
      crosshairs: {
        show: true
      }
    }
  });
  return <Card>
      <div className="p-3">
        <Typography variant="h6" sx={{
        pb: 3
      }}>
          Avg. Call Duration
        </Typography>

        <Typography variant="body2" lineHeight={1.2} fontSize={20} fontWeight={500} color="primary.main">
          10m: 52s
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Base on 100 calls
        </Typography>
      </div>

      <Box mt={-9} mx={-2}>
        <Chart type="area" options={options} series={series} height={200} />
      </Box>
    </Card>;
}