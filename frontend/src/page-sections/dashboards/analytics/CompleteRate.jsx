import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENT
import { Title } from '@/components/title';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Tasks',
  data: [70, 60, 90, 80, 100, 70, 80]
}];
export default function CompleteRate() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    chart: {
      offsetY: 30
    },
    stroke: {
      show: false
    },
    xaxis: {
      categories
    },
    colors: [theme.palette.divider, theme.palette.success[500]],
    plotOptions: {
      bar: {
        borderRadius: 7,
        columnWidth: '45%',
        distributed: true
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
  return <Card>
      <Box p={3} pb={0} position="relative" zIndex={2}>
        <Title title="55%" subtitle="Complete Rates" percentage="+12.5%" />
      </Box>

      <Box mt={-8}>
        <Chart type="bar" options={options} series={series} height={180} />
      </Box>
    </Card>;
}