import { useCallback, useState } from 'react';
import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Title } from '@/components/title';
// CUSTOM UTILS METHODS
import { formatK } from '@/utils/currency';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// STYLED COMPONENTS
const ChartWrapper = styled('div')({
  paddingLeft: '.7rem',
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

// REACT CHART DATA SERIES
const series = [{
  name: 'Sales',
  data: [8000, 4000, 4500, 17000, 18000, 40000, 18000, 10000, 6000, 20000]
}];

// REACT CHART CATEGORIES LABEL
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LIST = ['Revenue', 'Users', 'Deals', 'Profit'];
export default function ChartFilters() {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState(LIST[0]);
  const handleChange = useCallback(id => () => setSelectedItem(id), []);

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
  return <Card>
      <TopContentWrapper>
        {LIST.map(item => <BoxWrapper key={item} className="list-item" onClick={handleChange(item)} active={selectedItem === item ? 1 : 0}>
            <Typography noWrap variant="body2" lineHeight={1} fontWeight={500} color="text.secondary">
              {item}
            </Typography>
          </BoxWrapper>)}
      </TopContentWrapper>

      <Box px={3} pt={2} pb={1}>
        <Title title={22356} subtitle="Last month" percentage="+4.67%" />
      </Box>

      <ChartWrapper>
        <Chart type="area" height={300} series={series} options={options} />
      </ChartWrapper>
    </Card>;
}