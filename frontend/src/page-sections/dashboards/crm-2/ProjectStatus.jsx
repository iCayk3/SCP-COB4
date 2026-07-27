import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
export default function ProjectStatus() {
  const theme = useTheme();
  const chartOptions = useChartOptions({
    stroke: {
      width: 0
    },
    labels: ['In Progress', 'On Hold', 'Upcoming', 'Completed'],
    colors: [theme.palette.primary.main, theme.palette.warning.main, theme.palette.info.main, theme.palette.success.main],
    plotOptions: {
      pie: {
        donut: {
          size: '72%'
        }
      }
    },
    legend: {
      show: true,
      offsetY: 6,
      fontSize: '13px',
      fontWeight: 500,
      position: 'bottom',
      itemMargin: {
        horizontal: 10
      },
      markers: {
        strokeWidth: 0,
        size: 5,
        offsetX: -2
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
  return <Card className="p-3 h-full">
      <Typography variant="body1" sx={{
      mb: 3,
      fontWeight: 500,
      textAlign: 'center'
    }}>
        Project Status
      </Typography>

      <Chart height={350} type="donut" options={chartOptions} series={[50, 30, 20, 40]} />
    </Card>;
}