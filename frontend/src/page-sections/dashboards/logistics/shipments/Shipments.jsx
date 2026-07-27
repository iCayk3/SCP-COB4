import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM COMPONENTS
import Customers from './Customers';
import TotalShipments from './TotalShipments';
import MonthlyEarning from './MonthlyEarning';
import TotalOnlineSales from './TotalOnlineSales';

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Sales',
  data: [6, 15, 10, 17, 12, 19, 10]
}];
export default function Shipments() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    colors: [theme.palette.common.white],
    markers: {
      strokeColors: theme.palette.common.white
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.primary[400]
    },
    xaxis: {
      categories: categories,
      labels: {
        show: false
      },
      crosshairs: {
        show: true,
        fill: {
          color: theme.palette.common.white
        },
        stroke: {
          color: theme.palette.common.white
        }
      }
    },
    yaxis: {
      min: 0,
      max: 20,
      show: true,
      tickAmount: 2,
      labels: {
        style: {
          fontWeight: 500,
          colors: theme.palette.common.white
        }
      }
    }
  });
  return <Card className="h-full">
      {/* LAST MONTH SHIPMENT */}
      <Box bgcolor="primary.main" p={3} pb={8}>
        <Typography variant="h6" color="white" noWrap>
          Last Month Shipment
        </Typography>

        <Chart type="line" height={130} options={options} series={series} width="100%" />
      </Box>

      <Box p={3} mt={-11}>
        <Grid container spacing={2}>
          {/* TOTAL ONLINE SALES CARD */}
          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TotalOnlineSales />
          </Grid>

          {/* TOTAL SHIPMENTS CARD */}
          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TotalShipments />
          </Grid>

          {/* MONTHLY EARNING CARD */}
          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <MonthlyEarning />
          </Grid>

          {/* NEW CUSTOMER CARD */}
          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <Customers />
          </Grid>
        </Grid>
      </Box>
    </Card>;
}