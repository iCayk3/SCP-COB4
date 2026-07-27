import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';

// STYLED COMPONENT
const StyledRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  display: 'flex',
  backgroundColor: theme.palette.primary[50],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.background.paper
  }),
  '& .left-content': {
    padding: '1.5rem 1rem',
    backgroundColor: 'white',
    [theme.breakpoints.down('md')]: {
      minWidth: '30%'
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.background.paper
    })
  },
  '& .content-wrapper': {
    height: '60%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: theme.palette.primary.main
  },
  '& .right-content': {
    flex: 1,
    paddingBottom: '1.5rem'
  }
}));

// CHART DATA SERIES
const chartSeries = [{
  name: 'Tasks',
  data: [22, 30, 45, 45, 30, 22]
}];

// CHART CATEGORIES LABEL
const chartCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
export default function Tasks() {
  const theme = useTheme();

  // CHART OPTIONS
  const chartOptions = useChartOptions({
    chart: {
      offsetX: -5
    },
    stroke: {
      width: 0
    },
    colors: [theme.palette.primary.main],
    xaxis: {
      categories: chartCategories
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '30%',
        borderRadiusApplication: 'around'
      }
    },
    tooltip: {
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        formatter: val => currency(val),
        title: {
          formatter: seriesName => `${seriesName}:`
        }
      }
    }
  });
  return <StyledRoot>
      <div className="left-content">
        <Typography variant="body1" sx={{
        fontWeight: 500,
        mb: 6
      }}>
          Tasks
        </Typography>

        <div className="content-wrapper">
          <Typography variant="body2" sx={{
          fontSize: 18,
          fontWeight: 600
        }}>
            All
          </Typography>

          <Typography variant="h4" fontWeight={700}>
            64
          </Typography>

          <Typography variant="body2" sx={{
          fontSize: 18,
          fontWeight: 600
        }}>
            Tasks
          </Typography>
        </div>
      </div>

      <div className="right-content">
        <Chart type="bar" width="100%" height={220} series={chartSeries} options={chartOptions} />

        <Typography variant="body2" sx={{
        fontWeight: 600,
        textAlign: 'center',
        color: 'text.secondary'
      }}>
          Last 6 months
        </Typography>
      </div>
    </StyledRoot>;
}