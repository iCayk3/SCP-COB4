import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBox, FlexRowAlign } from '@/components/flexbox';
// CUSTOM HOOKS
import { useChartOptions } from '@/hooks/useChartOptions';

// STYLED COMPONENT
const StyledChart = styled(Chart)({
  marginTop: '.75rem',
  marginBottom: '1rem'
});
const Item = styled('div')(({
  theme
}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '1rem 1.5rem',
  borderTop: `1px dashed ${theme.palette.divider}`
}));

// CUSTOM DUMMY DATA
const BROWSERS = [{
  id: 1,
  value: 3.19,
  percentage: 60,
  title: 'Chrome',
  color: 'primary.main',
  image: '/static/browser/chrome.svg'
}, {
  id: 2,
  value: -1.98,
  percentage: 10,
  title: 'Opera Mini',
  color: 'success.500',
  image: '/static/browser/opera.svg'
}, {
  id: 3,
  value: 2.23,
  percentage: 30,
  title: 'Mozilla',
  color: 'grey.400',
  image: '/static/browser/mozilla.svg'
}];
export default function SessionBrowser() {
  const theme = useTheme();
  const {
    t
  } = useTranslation();
  const options = useChartOptions({
    stroke: {
      show: false
    },
    labels: ['Chrome', 'Opera Mini', 'Firefox'],
    colors: [theme.palette.primary.main, theme.palette.warning.main, theme.palette.success.main],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%'
        }
      }
    },
    tooltip: {
      y: {
        formatter: val => String(val),
        title: {
          formatter: series => series
        }
      }
    }
  });
  return <Card className="h-full">
      <Typography variant="body2" sx={{
      pt: 3,
      fontSize: 18,
      fontWeight: 500,
      textAlign: 'center'
    }}>
        {t('Session by browser')}
      </Typography>

      <StyledChart height={180} type="donut" options={options} series={[60, 10, 30]} />

      {BROWSERS.map(item => <Item key={item.id}>
          <FlexBox alignItems="center" gap={1} minWidth={120}>
            <Avatar variant="square" src={item.image} sx={{
          width: 30,
          height: 30
        }} />
            <Typography variant="body2" fontWeight={500}>
              {item.title}
            </Typography>
          </FlexBox>

          <FlexRowAlign gap={1} flexGrow={1}>
            <Box width={8} height={8} borderRadius="50%" bgcolor={item.color} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {item.percentage}%
            </Typography>
          </FlexRowAlign>

          <Typography variant="body2" color={item.value > 0 ? 'success.main' : 'error.main'}>
            {item.value}%
          </Typography>
        </Item>)}
    </Card>;
}