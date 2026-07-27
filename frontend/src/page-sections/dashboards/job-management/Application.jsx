import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBetween } from '@/components/flexbox';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// CHART SERIES
const series = [{
  name: 'Application',
  data: [10, 30, 5, 49, 55, 30, 70, 80, 100]
}];

// CHART CATEGORIES
const categories = ['12 Am', '1 Am', '2 Am', '3 Am', '4 Am', '5 Am', '6 Am', '7 Am', '8 Am'];
export default function Application() {
  const theme = useTheme();

  // CHART OPTIONS
  const options = useChartOptions({
    colors: [theme.palette.primary.main, theme.palette.primary[300], theme.palette.primary[100]],
    xaxis: {
      categories,
      labels: {
        show: true,
        style: {
          fontWeight: 500,
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      min: 0,
      max: 120,
      show: true,
      tickAmount: 4,
      labels: {
        formatter: value => `${value}%`,
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
        formatter: val => `${val}`,
        title: {
          formatter: name => `${name}:`
        }
      },
      style: {
        fontSize: '13px',
        fontFamily: theme.typography.fontFamily
      }
    }
  });
  return <Card>
      <FlexBetween pt={3} px={3}>
        <Typography variant="body1" fontWeight={500}>
          Application Received Time
        </Typography>

        <Select native size="small">
          <option value="sat">Sat</option>
          <option value="sun">Sun</option>
          <option value="mon">Mon</option>
          <option value="tue">Tue</option>
        </Select>
      </FlexBetween>

      <Box pl={1}>
        <Chart options={options} series={series} type="area" height={250} />
      </Box>
    </Card>;
}