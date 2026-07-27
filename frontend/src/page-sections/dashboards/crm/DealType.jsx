import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
export default function DealType() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    labels: ['Pending', 'Won', 'Loss'],
    stroke: {
      colors: [theme.palette.background.paper]
    },
    colors: [theme.palette.primary.main, theme.palette.success[500], theme.palette.grey[500]],
    legend: {
      show: true,
      fontSize: '13px',
      position: 'bottom',
      itemMargin: {
        horizontal: 7
      }
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              offsetY: 0
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 500,
              color: theme.palette.text.secondary,
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b) + '%';
              }
            },
            value: {
              show: true,
              offsetY: 6,
              fontSize: '18px',
              fontWeight: 600,
              formatter: val => val.toString()
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: val => String(val),
        title: {
          formatter: series => series
        }
      }
    }
  });
  return <Card className="p-3">
      <Typography variant="h6" sx={{
      pb: 3,
      textAlign: 'center'
    }}>
        Deal Type
      </Typography>

      <Chart height={220} type="donut" options={options} series={[40, 20, 20]} />
    </Card>;
}