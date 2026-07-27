import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART CATEGORIES LABEL
const categories = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Sales',
  data: [28000, 13000, 18000, 22000, 11000, 30000, 20000]
}];
export default function InvestmentTwo() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    stroke: {
      width: 0
    },
    grid: {
      show: true
    },
    colors: [theme.palette.primary.main, theme.palette.primary[300], theme.palette.primary[100]],
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
      tickAmount: 5,
      labels: {
        formatter: value => value / 1000 + 'K',
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        columnWidth: '17%',
        borderRadiusApplication: 'end',
        colors: {
          backgroundBarRadius: 9,
          backgroundBarOpacity: 0.4,
          backgroundBarColors: [theme.palette.grey[200]]
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val, {
          dataPointIndex,
          w
        }) {
          return `${w.globals.labels[dataPointIndex]} : ${val}`;
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
        Investment
      </Typography>

      <Chart type="bar" height={300} series={series} options={options} />
    </Card>;
}