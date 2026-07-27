import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// STYLED COMPONENT
const StyledRoot = styled(Card)(({
  theme
}) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down(630)]: {
    textAlign: 'center',
    rowGap: theme.spacing(2),
    flexDirection: 'column-reverse'
  }
}));
export default function WelcomeCard() {
  const theme = useTheme();
  const {
    t
  } = useTranslation();
  const options = useChartOptions({
    series: [76],
    labels: ['Progress'],
    fill: {
      type: 'solid',
      colors: [theme.palette.primary.main]
    },
    stroke: {
      lineCap: 'round',
      curve: 'smooth'
    },
    chart: {
      offsetY: -10,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 100,
        startAngle: -100,
        hollow: {
          size: '60%'
        },
        track: {
          strokeWidth: '97%',
          background: theme.palette.divider
        },
        dataLabels: {
          name: {
            offsetY: 8,
            fontSize: '14px',
            fontWeight: '500',
            color: theme.palette.text.secondary
          },
          value: {
            offsetY: -25,
            fontSize: '18px',
            fontWeight: '600'
          }
        }
      }
    }
  });
  return <StyledRoot>
      <div>
        <Typography variant="h6" sx={{
        mb: 1
      }}>
          {t('Welcome Back! Watson')}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{
        span: {
          color: 'primary.main'
        }
      }}>
          You have done <span>76%</span> more sales today. <br /> Check your inventory and update
          your stocks.
        </Typography>
      </div>

      <Chart height={170} options={options} series={[74]} width={200} type="radialBar" />
    </StyledRoot>;
}