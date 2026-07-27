import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART DATA SERIES
const series = [{
  name: 'Sales',
  data: [8000, 4000, 4500, 17000, 18000, 40000, 18000, 10000, 6000, 20000]
}];

// REACT CHART CATEGORIES LABEL
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export default function Investment() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    grid: {
      show: true
    },
    colors: [theme.palette.primary.main, theme.palette.primary[300], theme.palette.primary[100]],
    xaxis: {
      categories,
      crosshairs: {
        show: true
      },
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      min: 0,
      show: true,
      max: 50000,
      tickAmount: 5,
      labels: {
        formatter: value => value / 1000 + 'K',
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  });
  return <Card sx={{
    pt: 3,
    px: 2
  }}>
      <Typography variant="h6" sx={{
      px: 1
    }}>
        Investment
      </Typography>

      <Chart type="area" height={300} series={series} options={options} />
    </Card>;
}