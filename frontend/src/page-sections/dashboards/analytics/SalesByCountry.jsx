import Chart from 'react-apexcharts';
import { VectorMap } from '@south-paw/react-vector-maps';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
// WORLD MAP DATA
import worldMap from '@/__fakeData__/map/worldMap.json';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// STYLED COMPONENTS
const MapWrapper = styled('div')(({
  theme
}) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  svg: {
    stroke: '#fff',
    path: {
      outline: 'none',
      cursor: 'pointer',
      fill: theme.palette.grey[200],
      ':hover': {
        fill: theme.palette.primary.main
      }
    }
  }
}));

// REACT CHART CATEGORIES LABEL
const categories = ['AUS', 'USA', 'RSA', 'BRA', 'JAP', 'UAE', 'THI'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Tasks',
  data: [60, 40, 80, 60, 90, 70, 80]
}];

// ==============================================================

// ==============================================================

export default function SalesByCountry({
  chartHorizontal
}) {
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
    legend: {
      show: true,
      itemMargin: {
        ...(chartHorizontal && {
          vertical: 16
        })
      },
      labels: {
        colors: theme.palette.grey[400]
      },
      ...(chartHorizontal && {
        position: 'left'
      })
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        distributed: true,
        ...(chartHorizontal ? {
          horizontal: true,
          barHeight: '30%'
        } : {
          columnWidth: '30%',
          barHeight: '100%'
        })
      }
    },
    tooltip: {
      y: {
        formatter: function (val, {
          dataPointIndex,
          w
        }) {
          return `${w.globals.labels[dataPointIndex]} : ${val}`;
        }
      }
    }
  });
  return <Card sx={{
    height: '100%',
    p: 3
  }}>
      <div>
        <Typography variant="body2" fontSize={18} fontWeight={500}>
          Sales by Country
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Top 7 Countries
        </Typography>
      </div>

      <Grid container height="100%">
        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <Chart type="bar" height={350} series={series} options={options} />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <MapWrapper>
            <VectorMap {...worldMap} />
          </MapWrapper>
        </Grid>
      </Grid>
    </Card>;
}