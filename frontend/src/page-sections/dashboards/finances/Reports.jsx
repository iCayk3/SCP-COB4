import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM UTILS METHODS
import { currency } from '@/utils/currency';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
export default function Reports() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    labels: ['Expense', 'Revenue'],
    colors: [theme.palette.grey[300], theme.palette.primary.main],
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '80%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: '+20%',
              fontSize: '14px',
              fontWeight: 500,
              color: theme.palette.text.secondary,
              formatter: function (w) {
                return currency(w.globals.seriesTotals.reduce((a, b) => a + b));
              }
            },
            name: {
              offsetY: 23
            },
            value: {
              show: true,
              offsetY: -15,
              fontSize: '20px',
              fontWeight: 600
            }
          }
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '14px'
      },
      y: {
        formatter: val => `${val}`,
        title: {
          formatter: name => name
        }
      }
    },
    legend: {
      show: true,
      fontSize: '13px',
      position: 'bottom',
      itemMargin: {
        horizontal: 12
      }
    }
  });
  return <Card className="p-3">
      <Typography variant="h6" sx={{
      mb: 3,
      textAlign: 'center'
    }}>
        Reports
      </Typography>

      <Chart height={235} type="donut" series={[10000, 15000]} options={options} />
    </Card>;
}