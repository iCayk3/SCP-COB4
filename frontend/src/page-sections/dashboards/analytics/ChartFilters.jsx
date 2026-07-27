import { useCallback, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
// CUSTOM HOOKS
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM UTILS METHODS
import { format, formatK } from '@/utils/currency';

// STYLED COMPONENTS
const ChartWrapper = styled('div')({
  paddingLeft: '.5rem',
  paddingRight: '1rem'
});
const TopContentWrapper = styled('div')(({
  theme
}) => ({
  gap: '.5rem',
  display: 'flex',
  [theme.breakpoints.down(730)]: {
    flexDirection: 'column',
    '& .list-item': {
      flex: 1,
      borderRadius: '12px'
    }
  }
}));
const BoxWrapper = styled('div', {
  shouldForwardProp: prop => prop !== 'active'
})(({
  theme,
  active
}) => ({
  padding: '1.5rem',
  cursor: 'pointer',
  borderRadius: '0 0 12px 12px',
  ...(active && {
    backgroundColor: theme.palette.action.selected
  })
}));

// CUSTOM DUMMY DATA
const LIST = [{
  id: 1,
  title: 'Users',
  value: format(12060),
  percentage: 12.5
}, {
  id: 2,
  title: 'Sessions',
  value: format(30000),
  percentage: 5.56
}, {
  id: 3,
  title: 'Bounce Rate',
  value: '53%',
  percentage: -1.5
}, {
  id: 4,
  title: 'Session Duration',
  value: '3m 10s',
  percentage: -10.5
}];

// REACT CHART DATA SERIES
const series = [{
  name: 'Sales',
  data: [8000, 4000, 4500, 17000, 18000, 40000, 18000, 10000, 6000, 20000]
}];

// REACT CHART CATEGORIES LABEL
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ==============================================================

// ==============================================================

export default function ChartFilters({
  type = 'area'
}) {
  const theme = useTheme();
  const {
    t
  } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(LIST[1].id);
  const handleChange = useCallback(id => () => setSelectedItem(id), []);
  const maxValue = useMemo(() => Math.max(...series[0].data) * 1.2, [series]);
  const options = useChartOptions({
    legend: {
      show: false
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider
    },
    colors: [theme.palette.primary.main, theme.palette.primary[300], theme.palette.primary[100]],
    xaxis: {
      categories: categories,
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
      tickAmount: 5,
      max: maxValue,
      stepSize: maxValue / 5,
      labels: {
        formatter: value => formatK(value),
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  });
  return <Card>
      <TopContentWrapper>
        {LIST.map(item => <BoxWrapper key={item.id} className="list-item" onClick={handleChange(item.id)} active={selectedItem === item.id ? 1 : 0}>
            <Typography noWrap variant="body2" fontWeight={500} color="text.secondary">
              {t(item.title)}
            </Typography>

            <Typography variant="body2" fontWeight={600} fontSize={22}>
              {item.value}
            </Typography>

            <Typography variant="body2" fontWeight={500} color={item.percentage > 0 ? 'success.main' : 'error.main'}>
              {item.percentage > 0 && '+'}
              {item.percentage}%
            </Typography>
          </BoxWrapper>)}
      </TopContentWrapper>

      <ChartWrapper>
        <Chart type={type} height={335} series={series} options={options} />
      </ChartWrapper>
    </Card>;
}