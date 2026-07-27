import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { Percentage } from '@/components/percentage';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM UTILS METHOD
import { currency, formatK } from '@/utils/currency';

// REACT CHART DATA SERIES
const series = [{
  name: 'Sales',
  data: [8000, 4000, 4500, 17000, 18000, 40000, 18000, 10000, 6000, 20000]
}];

// REACT CHART CATEGORIES LABEL
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export default function CompanyProgress() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    grid: {
      show: true
    },
    colors: [theme.palette.primary.main, theme.palette.primary[300], theme.palette.primary[100]],
    xaxis: {
      categories,
      crosshairs: {
        show: true
      },
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      min: 0,
      show: true,
      max: 50000,
      tickAmount: 5,
      labels: {
        formatter: value => formatK(value),
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  });
  return <Card sx={{
    pt: 3,
    px: 2
  }}>
      <Typography variant="body2" sx={{
      px: 2,
      fontSize: 18,
      fontWeight: 500
    }}>
        Company Progress
      </Typography>

      <FlexBox p={2} gap={2} alignItems="center" flexWrap="wrap">
        <div>
          <FlexBox alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight={600} fontSize={22} color="primary.main">
              {currency(18469)}
            </Typography>

            <Percentage type="error">-2.37%</Percentage>
          </FlexBox>

          <Typography variant="body2" color="text.secondary">
            This month
          </Typography>
        </div>

        <div>
          <FlexBox alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight={600} fontSize={22}>
              {currency(22356)}
            </Typography>

            <Percentage>+4.67%</Percentage>
          </FlexBox>

          <Typography variant="body2" color="text.secondary">
            Last month
          </Typography>
        </div>
      </FlexBox>

      <Chart type="area" height={270} series={series} options={options} />
    </Card>;
}