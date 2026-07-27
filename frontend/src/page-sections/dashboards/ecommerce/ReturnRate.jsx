import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART CATEGORIES LABEL
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Returning',
  data: [20, 150, 75, 150, 300, 400]
}, {
  name: 'New',
  data: [0, 250, 100, 17, 122, 18]
}];
export default function ReturnRate() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    colors: [theme.palette.success.main, theme.palette.primary.main],
    markers: {
      strokeColors: theme.palette.success.main
    },
    legend: {
      show: true,
      position: 'top'
    },
    grid: {
      show: true
    },
    xaxis: {
      categories: categories,
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary
        }
      },
      crosshairs: {
        show: true,
        fill: {
          color: theme.palette.success.main
        },
        stroke: {
          color: theme.palette.success.main
        }
      }
    },
    yaxis: {
      min: 0,
      max: 500,
      show: true,
      tickAmount: 5,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontWeight: 500
        }
      }
    }
  });
  return <Card className="h-full">
      <Box p={3}>
        <Typography variant="h5" sx={{
        fontSize: 22,
        fontWeight: 600,
        lineHeight: 1.3,
        span: {
          pl: 1,
          fontSize: 14,
          color: 'success.main'
        }
      }}>
          50%
          <span>+2.5%</span>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Returning Rate
        </Typography>
      </Box>

      <Box pl={1} pr={2}>
        <Chart type="line" height={280} options={options} series={series} width="100%" />
      </Box>
    </Card>;
}