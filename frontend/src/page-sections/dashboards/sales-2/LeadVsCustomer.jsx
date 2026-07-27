import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// REACT APEX CHART
import Chart from 'react-apexcharts';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// CHART DATA SERIES
const series = [{
  name: 'Leads',
  data: [10, 30, 85, 49, 55, 35, 60]
}, {
  name: 'Customers',
  data: [50, 34, 45, 79, 35, 70, 120]
}];

// CHART CATEGORIES
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export default function LeadVSCustomer() {
  const theme = useTheme();

  // APEX CHART OPTIONS
  const options = useChartOptions({
    grid: {
      show: true
    },
    colors: [theme.palette.primary.main, theme.palette.warning.main],
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
          formatter: val => `${val}`
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      fontWeight: 600,
      fontSize: '13px',
      itemMargin: {
        horizontal: 15
      }
    }
  });
  return <Card className="p-3 h-full pb-0">
      <FlexBetween mb={2}>
        <Typography variant="h6" fontSize={16}>
          Leads VS Customers
        </Typography>

        <Select native size="small">
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </Select>
      </FlexBetween>

      <Chart options={options} series={series} type="line" height={265} />
    </Card>;
}