import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
export default function Candidates() {
  const theme = useTheme();
  const options = useChartOptions({
    labels: ['Male', 'Female'],
    colors: [theme.palette.primary.main, theme.palette.primary[100]],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%'
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: 8,
            fontSize: '28px',
            fontWeight: 600,
            formatter: value => `${value}%`,
            color: theme.palette.primary.main
          }
        },
        track: {
          margin: 0,
          strokeWidth: '100%',
          background: theme.palette.primary[100]
        }
      }
    },
    legend: {
      show: true,
      fontWeight: 500,
      fontSize: '13px',
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
        strokeWidth: 0
      }
    }
  });
  return <Card className="p-3 h-full">
      <Typography variant="body1" fontWeight={500} sx={{
      textAlign: 'center'
    }}>
        Candidates by Gender
      </Typography>

      <Chart type="radialBar" height={250} options={options} series={[70]} />
    </Card>;
}