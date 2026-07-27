import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Percentage } from '@/components/percentage';
import { FlexBox } from '@/components/flexbox';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM UTILS METHODS
import { format } from '@/utils/currency';

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Tasks',
  data: [22, 30, 46, 50, 46, 30, 22]
}];
export default function DailySales() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    stroke: {
      show: false
    },
    xaxis: {
      categories: categories
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
      <Box p={3} pb={0}>
        <FlexBox alignItems="center" gap={1} mb={1}>
          <Typography variant="h5" sx={{
          span: {
            fontSize: 18,
            fontWeight: 500,
            color: 'grey.400'
          }
        }}>
            <span>$</span>
            {format(51352)}
          </Typography>

          <Percentage type="success">+12.5%</Percentage>
        </FlexBox>

        <Typography variant="body2" color="text.secondary">
          Average Daily Sales
        </Typography>
      </Box>

      <Box mt={-2}>
        <Chart type="bar" series={series} options={options} height={150} />
      </Box>
    </Card>;
}