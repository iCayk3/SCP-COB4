import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM UTILS
import { currency } from '@/utils/currency';
export default function SalesProductDetails() {
  const theme = useTheme();
  const {
    t
  } = useTranslation();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    labels: ['Electronics', 'Furniture', 'Accessories'],
    colors: [theme.palette.primary.main, '#FF9777', '#FF6B93'],
    stroke: {
      lineCap: 'round',
      curve: 'smooth'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '25%'
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            show: false
          }
        },
        track: {
          margin: 15,
          background: theme.palette.divider
        }
      }
    },
    legend: {
      show: true,
      fontSize: '13px',
      fontWeight: 500,
      position: 'bottom',
      onItemClick: {
        toggleDataSeries: false
      },
      onItemHover: {
        highlightDataSeries: false
      }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: value => currency(value)
      }
    }
  });
  return <Card className="p-3 pb-1">
      <Typography variant="h6" sx={{
      textAlign: 'center'
    }}>
        {t('Sales Product Details')}
      </Typography>

      <Chart options={options} series={[75, 50, 25]} type="radialBar" height={340} />
    </Card>;
}