import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// REACT APEX CHART
import Chart from 'react-apexcharts';
//  CUSTOM COMPONENTS
import { FlexBox, FlexBetween } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
// CUSTOM HOOKS
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART DATA SERIES
const series = [{
  name: 'Total',
  data: [10, 30, 85, 49, 55, 35, 60]
}, {
  name: 'Average',
  data: [50, 34, 45, 79, 35, 70, 120]
}];

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export default function RevenueStatistics() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    grid: {
      show: true
    },
    colors: [theme.palette.primary.main, theme.palette.grey[300]],
    xaxis: {
      categories: categories,
      labels: {
        show: true,
        style: {
          fontWeight: 500,
          colors: theme.palette.text.secondary
        }
      },
      crosshairs: {
        show: true,
        stroke: {
          color: theme.palette.divider
        }
      }
    },
    yaxis: {
      min: 0,
      max: 200,
      show: true,
      tickAmount: 5,
      labels: {
        style: {
          fontWeight: 500,
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      shared: true,
      x: {
        show: false
      },
      marker: {
        show: true
      },
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
  return <Card className="p-3 h-full pb-0">
      <FlexBetween mb={2}>
        <Typography variant="h6">Revenue Statistics</Typography>

        <Select native size="small">
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </Select>
      </FlexBetween>

      <FlexBox mb={2} gap={4}>
        <div>
          <Typography variant="h6" fontWeight={600}>
            {currency(56765)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Total Sale
          </Typography>
        </div>

        <div>
          <Typography variant="h6" fontWeight={600}>
            {currency(350)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Average Sale
          </Typography>
        </div>
      </FlexBox>

      <Chart options={options} series={series} type="line" height={250} />
    </Card>;
}