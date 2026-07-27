import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme, styled, alpha } from '@mui/material/styles';
import TrendingUp from '@mui/icons-material/TrendingUp';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// STYLED COMPONENTS
const StyledRoot = styled(Card)(({
  theme
}) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '1.5rem',
  '& .avatar': {
    width: 22,
    height: 22,
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1)
  }
}));

// ==============================================================

// ==============================================================

export default function CommonCard({
  card
}) {
  const theme = useTheme();
  const options = useChartOptions({
    colors: [theme.palette.primary.main],
    stroke: {
      curve: 'smooth',
      lineCap: 'round'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '55%'
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: 8,
            fontSize: '18px',
            fontWeight: 600,
            formatter: value => `${value}%`,
            color: theme.palette.primary.main,
            fontFamily: theme.typography.fontFamily
          }
        },
        track: {
          strokeWidth: '100%',
          background: theme.palette.primary[100]
        }
      }
    }
  });
  return <StyledRoot>
      <div>
        <Typography variant="body2" fontWeight={500} color="text.secondary">
          {card.title}
        </Typography>

        <Typography lineHeight={1.6} variant="h5">
          {card.amount}
        </Typography>

        <FlexBox gap={1} alignItems="center" mt={2}>
          <Avatar variant="rounded" className="avatar">
            <TrendingUp sx={{
            fontSize: 16,
            color: 'inherit'
          }} />
          </Avatar>

          <Typography variant="body2">+{card.trend}% Inc</Typography>
        </FlexBox>
      </div>

      <Chart width={160} height={140} type="radialBar" options={options} series={[card.progress]} />
    </StyledRoot>;
}