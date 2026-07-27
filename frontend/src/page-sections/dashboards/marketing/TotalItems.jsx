import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Title } from '@/components/title';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Items',
  data: [22, 30, 46, 50, 46, 30, 22]
}];
export default function TotalItems() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    chart: {
      offsetY: 10
    },
    stroke: {
      show: false
    },
    xaxis: {
      categories
    },
    colors: [theme.palette.divider, theme.palette.primary.main],
    plotOptions: {
      bar: {
        borderRadius: 5,
        distributed: true,
        columnWidth: '40%',
        borderRadiusApplication: 'end'
      }
    },
    tooltip: {
      y: {
        formatter: (val, {
          dataPointIndex,
          w
        }) => {
          return `${w.globals.labels[dataPointIndex]} : ${val}`;
        }
      }
    }
  });
  return <Card>
      <Box p={3} pb={0} position="relative" zIndex={1}>
        <Title title={1352} subtitle="Total Items" percentageType="primary" percentage="+12.5%" />
      </Box>

      <Box mt={-5}>
        <Chart type="bar" series={series} options={options} height={160} />
      </Box>
    </Card>;
}