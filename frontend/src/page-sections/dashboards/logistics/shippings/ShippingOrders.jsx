import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Orders',
  data: [22, 30, 46, 50, 46, 30, 22]
}];
export default function ShippingOrders() {
  const theme = useTheme();

  // THIS MONTH REACT CHART OPTIONS
  const options = useChartOptions({
    stroke: {
      show: false
    },
    xaxis: {
      categories
    },
    colors: [theme.palette.divider, theme.palette.primary.main],
    plotOptions: {
      bar: {
        borderRadius: 7,
        distributed: true,
        columnWidth: '50%',
        borderRadiusApplication: 'end'
      }
    },
    tooltip: {
      y: {
        formatter: (val, {
          dataPointIndex,
          w
        }) => {
          return `${w.globals.labels[dataPointIndex]} : ${val}`;
        }
      }
    }
  });
  return <Box sx={{
    p: 3,
    mb: -3
  }}>
      <Typography variant="h6">Shipping orders</Typography>
      <Typography variant="body2" color="text.secondary">
        This Month
      </Typography>

      <Chart type="bar" series={series} options={options} height={200} />
    </Box>;
}