import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// STYLED COMPONENT
export const StyledRoot = styled(Card)(() => ({
  height: '100%',
  padding: '1.5rem 1.5rem 0 1.5rem'
}));
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const series = [{
  name: 'React',
  data: [22, 30, 46, 50, 46, 30, 22]
}, {
  name: 'Angular',
  data: [36, 40, 56, 75, 56, 40, 36]
}, {
  name: 'Javascript',
  data: [50, 60, 70, 90, 70, 60, 50]
}];
export default function StudyTime() {
  const theme = useTheme();
  const {
    t
  } = useTranslation();
  const options = useChartOptions({
    chart: {
      stacked: true
    },
    stroke: {
      show: false,
      width: 0
    },
    colors: [theme.palette.primary.main, theme.palette.primary[300], theme.palette.primary[100]],
    yaxis: {
      show: false
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontWeight: 500,
          colors: theme.palette.text.secondary
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '30%'
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
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '13px',
      fontWeight: 500,
      itemMargin: {
        horizontal: 10
      },
      onItemClick: {
        toggleDataSeries: false
      },
      onItemHover: {
        highlightDataSeries: false
      },
      markers: {
        size: 5,
        strokeWidth: 0,
        offsetX: -2,
        shape: 'circle'
      }
    }
  });
  return <StyledRoot>
      <Typography variant="body1" fontWeight={500}>
        {t('Study Time Last Week')}
      </Typography>

      <Chart type="bar" options={options} series={series} height={275} />
    </StyledRoot>;
}