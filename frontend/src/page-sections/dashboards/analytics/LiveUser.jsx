import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOKS
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART DATA SERIES
const series = [{
  name: 'Tasks',
  data: [22, 30, 46, 50, 46, 30, 22]
}];

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export default function LiveUser() {
  const theme = useTheme();
  const {
    t
  } = useTranslation();
  const options = useChartOptions({
    stroke: {
      show: false
    },
    xaxis: {
      categories: categories
    },
    colors: [theme.palette.divider, theme.palette.primary.main],
    plotOptions: {
      bar: {
        borderRadius: 7,
        columnWidth: '40%',
        distributed: true
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
      <div>
        <Typography variant="body2" color="text.secondary">
          {t('Live Online User')}
        </Typography>

        <Typography variant="body2" fontSize={28} fontWeight={600}>
          348
        </Typography>
      </div>

      <Typography variant="body2" sx={{
      mt: 3,
      span: {
        color: 'text.secondary'
      }
    }}>
        {t('Page views')} <span>/ Second</span>
      </Typography>

      <Chart type="bar" options={options} series={series} height={260} />

      <Button color="secondary" fullWidth>
        {t('View Details')}
      </Button>
    </Card>;
}