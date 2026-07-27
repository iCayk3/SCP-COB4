import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Title } from '@/components/title';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
export default function AveragePosition() {
  const theme = useTheme();

  // REACT CHART DATA SERIES
  const series = [{
    name: 'Sales',
    data: [6, 15, 10, 17]
  }];

  // REACT CHART OPTIONS
  const options = useChartOptions({
    colors: [theme.palette.success.main],
    markers: {
      strokeColors: theme.palette.success.main
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr'],
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary
        }
      },
      crosshairs: {
        show: true,
        fill: {
          color: theme.palette.success.main
        },
        stroke: {
          color: theme.palette.success.main
        }
      }
    },
    yaxis: {
      min: 0,
      show: true,
      tickAmount: 6,
      max: Math.max(...series[0].data) * 1.2,
      labels: {
        formatter: value => `${Math.floor(value)}`,
        style: {
          colors: theme.palette.text.secondary,
          fontWeight: 500
        }
      }
    }
  });
  return <Card className="h-full">
      <Box mb={4} px={3} pt={3}>
        <Title title="5.8" subtitle="Average Positions" percentage="+12.5%" />
      </Box>

      <Box px={1}>
        <Chart type="line" height={335} options={options} series={series} width="100%" />
      </Box>
    </Card>;
}