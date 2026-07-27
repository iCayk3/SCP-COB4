import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// MUI ICON COMPONENTS
import Euro from '@mui/icons-material/Euro';
import AttachMoney from '@mui/icons-material/AttachMoney';
import CurrencyPound from '@mui/icons-material/CurrencyPound';
// CUSTOM COMPONENTS
import ListItem from './shared/ListItem';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// DUMMY DATA SET
const DATA = [{
  id: 1,
  title: 'USD',
  Icon: AttachMoney,
  value1: 94.65,
  value2: 2.5
}, {
  id: 2,
  title: 'EURO',
  Icon: Euro,
  value1: 26.37,
  value2: -1.56
}, {
  id: 3,
  title: 'GBP',
  Icon: CurrencyPound,
  value1: 55.24,
  value2: 3.23
}];

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Tasks',
  data: [22, 30, 46, 50, 46, 30, 22]
}];
export default function CurrentCurrencyTwo() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    chart: {
      offsetY: 20
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
  return <Card className="p-3 h-full">
      <Grid container spacing={2}>
        <Grid size={{
        sm: 6,
        xs: 12
      }}>
          <Typography variant="body2" mb={3} fontSize={18} fontWeight={500}>
            Current Currency
          </Typography>

          <Stack spacing={2}>
            {DATA.map(({
            Icon,
            id,
            title,
            value1,
            value2
          }) => <FlexBetween key={id}>
                <ListItem title={title} Icon={<Icon fontSize="small" color={title === 'EURO' ? 'success' : title === 'GBP' ? 'warning' : 'primary'} />} />

                <div>
                  <Typography variant="body2" fontWeight={500}>
                    {value1}%
                  </Typography>

                  <Typography variant="body2" textAlign="end" color={value2 > 0 ? 'success.500' : 'error.main'}>
                    {value2 > 0 && '+'}
                    {value2}%
                  </Typography>
                </div>
              </FlexBetween>)}
          </Stack>
        </Grid>

        <Grid size={{
        sm: 6,
        xs: 12
      }}>
          <Chart type="bar" series={series} options={options} height={190} />
        </Grid>
      </Grid>
    </Card>;
}