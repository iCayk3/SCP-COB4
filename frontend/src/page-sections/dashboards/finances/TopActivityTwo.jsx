import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM UTILS METHOD
import { useChartOptions } from '@/hooks/useChartOptions';
export default function TopActivityTwo() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    labels: ['Asia', 'Europe', 'Africa'],
    colors: [theme.palette.primary.main, theme.palette.grey[400], theme.palette.grey[300]],
    stroke: {
      width: 0
    },
    legend: {
      offsetY: 12,
      show: true,
      fontSize: '13px',
      position: 'bottom',
      itemMargin: {
        horizontal: 12
      },
      onItemClick: {
        toggleDataSeries: false
      },
      onItemHover: {
        highlightDataSeries: false
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
    }
  });
  return <Card className="p-3 h-full">
      <Typography variant="h6" sx={{
      mb: 3,
      textAlign: 'center'
    }}>
        Top Activity
      </Typography>

      <Chart type="pie" height={265} series={[55, 45, 33]} options={options} />
    </Card>;
}