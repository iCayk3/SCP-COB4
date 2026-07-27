import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM UTILS METHODS
import { currency, formatK } from '@/utils/currency';

// REACT CHART CATEGORIES LABEL
const categories = ['Goal', 'Pending', 'Profit'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Sales',
  data: [50000, 28000, 40000]
}];
export default function SalesForecast() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    stroke: {
      width: 0
    },
    grid: {
      show: true
    },
    colors: [theme.palette.primary.main, theme.palette.grey[700], theme.palette.grey[400]],
    xaxis: {
      categories,
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
      tickAmount: 3,
      labels: {
        formatter: value => formatK(value),
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        distributed: true,
        columnWidth: '17%',
        borderRadiusApplication: 'end'
      }
    },
    tooltip: {
      y: {
        formatter: function (val, {
          dataPointIndex,
          w
        }) {
          return `${w.globals.labels[dataPointIndex]} : ${currency(val)}`;
        }
      }
    }
  });
  return <Card sx={{
    pt: 3,
    px: 1
  }}>
      <Typography variant="h6" sx={{
      px: 2
    }}>
        Sales Forecast
      </Typography>

      <Chart type="bar" height={220} series={series} options={options} />
    </Card>;
}