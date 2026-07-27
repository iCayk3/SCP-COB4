import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM UTILS METHOD
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART CATEGORIES LABEL
const categories = ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Sales',
  data: [38000, 48000, 50000, 40000, 42000, 30000, 33000]
}];
export default function Sales() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    stroke: {
      width: 0
    },
    grid: {
      show: true
    },
    colors: [theme.palette.primary.main, theme.palette.divider],
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
        Sales
      </Typography>

      <Chart type="bar" height={315} series={series} options={options} />
    </Card>;
}