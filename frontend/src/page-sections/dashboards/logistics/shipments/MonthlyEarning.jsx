import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import Heading from './Heading';
// CUSTOM UTILS METHODS
import { currency } from '@/utils/currency';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// STYLED COMPONENT
import { CardWrapper } from './styles';

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Earnings',
  data: [6, 15, 10, 17, 12, 19, 10]
}];
export default function MonthlyEarning() {
  const theme = useTheme();

  // TOTAL SHIPMENTS REACT CHART OPTIONS
  const options = useChartOptions({
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
        columnWidth: '70%',
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
  return <CardWrapper>
      <Heading percentage="+3.33%" subtitle="Monthly Earning" title={currency(5000)} />

      <Box mb={-3} mx={-1}>
        <Chart type="bar" height={110} series={series} options={options} />
      </Box>
    </CardWrapper>;
}