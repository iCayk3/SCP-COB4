import Chart from 'react-apexcharts';
import Typography from '@mui/material/Typography';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
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
const CURRENCIES = [{
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
export default function CurrentCurrency() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    labels: ['USD', 'EURO', 'GBP'],
    stroke: {
      width: 1,
      colors: [theme.palette.background.paper]
    },
    colors: [theme.palette.primary.main, theme.palette.warning.main, theme.palette.success[500]],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '80%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Increase',
              fontSize: '14px',
              fontWeight: 500,
              color: theme.palette.text.secondary,
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b) + '%';
              }
            },
            value: {
              show: true,
              offsetY: 4,
              fontSize: '24px',
              fontWeight: 700,
              formatter: val => val.toString()
            }
          }
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '14px'
      },
      y: {
        formatter: val => `${val}`,
        title: {
          formatter: name => name
        }
      }
    },
    chart: {
      dropShadow: {
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.1,
        enabled: true,
        color: '#5D5D69'
      }
    }
  });
  return <Card sx={{
    py: 3,
    pr: 3,
    height: '100%'
  }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{
        sm: 6,
        xs: 12
      }}>
          <Chart height={200} width="100%" type="donut" series={[33, 33, 33]} options={options} />
        </Grid>

        <Grid size={{
        sm: 6,
        xs: 12
      }}>
          <Typography variant="h6" sx={{
          mb: 2
        }}>
            Current Currency
          </Typography>

          <Stack spacing={2}>
            {CURRENCIES.map(({
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
      </Grid>
    </Card>;
}