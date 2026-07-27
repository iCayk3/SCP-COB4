import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// REACT APEX CHART
import Chart from 'react-apexcharts';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';

// CHART DATA SERIES
const chartSeries = [{
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
  const options = {
    chart: {
      stacked: false,
      background: 'none',
      toolbar: {
        show: false
      },
      fontFamily: theme.typography.fontFamily
    },
    grid: {
      show: false
    },
    stroke: {
      curve: 'smooth'
    },
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    colors: [theme.palette.primary.main, theme.palette.warning.main],
    xaxis: {
      categories,
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      },
      labels: {
        style: {
          fontWeight: 500,
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      min: 0,
      max: 150,
      tickAmount: 3,
      labels: {
        style: {
          fontWeight: 500,
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter: val => `${val}`
      }
    },
    legend: {
      position: 'top',
      fontWeight: 600,
      fontSize: '14px',
      itemMargin: {
        horizontal: 15
      },
      markers: {
        strokeWidth: 0,
        size: 5,
        offsetX: -2
      }
    }
  };
  return <Card className="p-3 h-full pb-0">
      <FlexBetween mb={2}>
        <Typography variant="body1" fontWeight={500}>
          Leads VS Customers
        </Typography>

        <Select native size="small">
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </Select>
      </FlexBetween>

      <Chart options={options} series={chartSeries} type="line" height={230} />
    </Card>;
}