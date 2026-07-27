import { NavLink } from 'react-router';
import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ShowChart from '@mui/icons-material/ShowChart';
// CUSTOM COMPONENTS
import { FlexBox, FlexBetween } from '@/components/flexbox';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// CHART DATA SERIES
const series = [{
  name: 'Orders',
  data: [10, 30, 49, 55, 30, 70, 100]
}];

// CHART CATEGORIES
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export default function OrderStats() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    colors: [theme.palette.primary.main, theme.palette.primary[300], theme.palette.primary[100]],
    xaxis: {
      crosshairs: {
        show: true
      },
      categories: categories,
      labels: {
        show: true,
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
      style: {
        fontSize: '13px'
      },
      y: {
        formatter: val => `${val}`,
        title: {
          formatter: name => `${name}:`
        }
      }
    }
  });
  return <Card className="p-3 pb-0">
      <FlexBetween>
        <Typography variant="h6">Order Stats</Typography>
        <NavLink to="#" style={{
        fontSize: 14,
        fontWeight: 500
      }}>
          View all
        </NavLink>
      </FlexBetween>

      <FlexBetween mt={2}>
        <div>
          <Typography variant="h6" fontWeight={600} lineHeight={1}>
            125
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Total Orders
          </Typography>
        </div>

        <FlexBox alignItems="center" gap={0.5}>
          <ShowChart fontSize="small" color="primary" />
          <Typography variant="body2" lineHeight={1} fontWeight={500} color="text.secondary">
            15% increased
          </Typography>
        </FlexBox>
      </FlexBetween>

      <Chart options={options} series={series} type="area" height={230} />
    </Card>;
}