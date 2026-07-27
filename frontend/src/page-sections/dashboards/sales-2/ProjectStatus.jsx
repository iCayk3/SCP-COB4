import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// REACT APEX CHART
import Chart from 'react-apexcharts';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
export default function ProjectStatus() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    stroke: {
      width: 0
    },
    labels: ['Transactions', 'Payouts', 'Sales', 'Reports'],
    colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.grey[200]],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              fontWeight: 600,
              showAlways: true,
              fontSize: '14px',
              label: 'Avg Range',
              color: theme.palette.text.secondary,
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
              }
            },
            value: {
              show: true,
              fontWeight: 600,
              fontSize: '27px',
              formatter: val => val.toString()
            }
          }
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '13px',
      fontWeight: 500,
      itemMargin: {
        horizontal: 10,
        vertical: 5
      },
      onItemClick: {
        toggleDataSeries: false
      },
      onItemHover: {
        highlightDataSeries: false
      },
      markers: {
        size: 5,
        offsetX: -2,
        strokeWidth: 0
      }
    },
    tooltip: {
      style: {
        fontSize: '13px'
      },
      y: {
        formatter: val => `${val}`,
        title: {
          formatter: series => `${series}:`
        }
      }
    }
  });
  return <Card className="p-3 h-full">
      <Typography variant="h6" sx={{
      fontSize: 16,
      textAlign: 'center',
      mb: 3
    }}>
        Project Status
      </Typography>

      <Chart height={280} type="donut" options={options} series={[50, 30, 20, 40]} />
    </Card>;
}