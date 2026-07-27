import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

//   CHART DATA SERIES
const series = [{
  name: 'Manager',
  data: [22, 30, 46, 50, 46, 30, 22]
}, {
  name: 'Marketer',
  data: [36, 40, 56, 75, 56, 40, 36]
}, {
  name: 'Developer',
  data: [50, 60, 70, 90, 70, 60, 50]
}];

//   CHART CATEGORIES
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export default function RecentJob() {
  const theme = useTheme();

  // CHART OPTIONS
  const options = useChartOptions({
    chart: {
      stacked: true
    },
    stroke: {
      show: true,
      width: 0
    },
    colors: [theme.palette.primary.main, theme.palette.primary[300], theme.palette.primary[100]],
    xaxis: {
      categories: categories,
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
        columnWidth: '30%',
        rangeBarOverlap: false
      }
    },
    tooltip: {
      y: {
        formatter: val => `${val}`,
        title: {
          formatter: val => `${val}:`
        }
      }
    },
    legend: {
      show: true,
      fontSize: '13px',
      fontWeight: 500,
      position: 'bottom',
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
        offsetX: -2,
        shape: 'circle',
        strokeWidth: 0
      }
    }
  });
  return <Card className="p-3 h-full pb-0">
      <Typography variant="body1" fontWeight={500}>
        Recent Job Applications
      </Typography>

      <Chart type="bar" options={options} series={series} height={275} />
    </Card>;
}