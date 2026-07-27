import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM UTILS METHOD
import { currency, formatK } from '@/utils/currency';

// REACT CHART DATA SERIES
const series = [{
  name: 'Sales',
  data: [30000, 20000, 45000, 40000, 48000, 25000, 40000]
}];

// REACT CHART CATEGORIES LABEL
const categories = ['70% ECR', 'FGI 50%', 'EOQ 80%', 'FMG 75%', 'PLG 90%', 'OLX 60%', 'FCR 70%'];
export default function TopSellingCategories() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    stroke: {
      width: 0
    },
    colors: [theme.palette.primary.main, theme.palette.divider],
    grid: {
      show: true
    },
    xaxis: {
      crosshairs: {
        show: true
      },
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
        formatter: value => formatK(value),
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 15,
        distributed: true,
        columnWidth: '30',
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
    },
    responsive: [{
      breakpoint: theme.breakpoints.values.sm,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 10,
            horizontal: true
          }
        },
        xaxis: {
          labels: {
            formatter: value => value > 0 ? `${Math.round(value / 1000)}K` : value
          }
        },
        yaxis: {
          show: true,
          labels: {
            style: {
              fontWeight: 500,
              colors: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily
            }
          }
        }
      }
    }]
  });
  return <Card sx={{
    pt: 3,
    px: 2
  }}>
      <Typography variant="h6" sx={{
      px: 1
    }}>
        Top Selling Categories
      </Typography>

      <Chart type="bar" height={300} series={series} options={options} />
    </Card>;
}