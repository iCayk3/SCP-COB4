import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
export default function Audits() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    labels: ['Audits'],
    stroke: {
      lineCap: 'round'
    },
    colors: [theme.palette.primary.main],
    plotOptions: {
      radialBar: {
        track: {
          show: false
        },
        dataLabels: {
          show: false
        },
        hollow: {
          margin: 15,
          size: '50%',
          background: theme.palette.primary.main,
          dropShadow: {
            enabled: true,
            opacity: 0.2
          }
        }
      }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: val => `${val}`
      }
    }
  });
  return <Card className="p-3">
      <Typography variant="h6">Audits</Typography>

      <Chart type="radialBar" height={200} series={[70]} options={options} />

      <Typography variant="body2" lineHeight={1.2} fontSize={20} fontWeight={500}>
        50%
      </Typography>

      <Typography variant="body2" mb={0.5} color="text.secondary">
        Access Grant
      </Typography>

      <LinearProgress value={60} variant="determinate" sx={{
      height: 8
    }} />
    </Card>;
}