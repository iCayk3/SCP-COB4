import { useCallback, useState } from 'react';
import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
import { Percentage } from '@/components/percentage';
// CUSTOM UTILS METHODS
import { currency, formatK } from '@/utils/currency';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// STYLED COMPONENTS
const ChartWrapper = styled('div')({
  paddingInline: 8
});
const ButtonList = styled('div')(({
  theme
}) => ({
  gap: '.5rem',
  display: 'flex',
  paddingLeft: '1.5rem',
  [theme.breakpoints.down(730)]: {
    paddingLeft: 0,
    flexWrap: 'wrap',
    '& .list-item': {
      borderRadius: '8px'
    }
  }
}));
const ButtonItem = styled('div', {
  shouldForwardProp: prop => prop !== 'active'
})(({
  theme,
  active
}) => ({
  padding: '1rem',
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
const LIST = ['E-mail', 'Social', 'TV', 'Google Ads', 'Courses', 'Holiday'];
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
    },
    tooltip: {
      y: {
        formatter: function (val, {
          dataPointIndex,
          w
        }) {
          return `${w.globals.categoryLabels[dataPointIndex]} : ${currency(val)}`;
        }
      }
    }
  });
  return <Card>
      <ButtonList>
        {LIST.map(item => <ButtonItem key={item} className="list-item" onClick={handleChange(item)} active={selectedItem === item ? 1 : 0}>
            <Typography noWrap variant="body2" fontWeight={500} color="text.secondary">
              {item}
            </Typography>
          </ButtonItem>)}
      </ButtonList>

      <FlexBox sx={{
      p: 3,
      pb: 1,
      rowGap: 2,
      columnGap: 6,
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
        <Stat amount={10000} percentage={-3.25} description="Last Month Social Campaign" />
        <Stat amount={18000} percentage={4.67} description="This Month Social Campaign" />
      </FlexBox>

      <ChartWrapper>
        <Chart type="area" height={290} series={series} options={options} />
      </ChartWrapper>
    </Card>;
}

// ==============================================================

// ==============================================================

function Stat({
  amount,
  percentage,
  description
}) {
  return <div>
      <FlexBox alignItems="center" gap={1}>
        <Typography variant="body2" fontSize={24} fontWeight={600}>
          {formatK(amount)}
        </Typography>

        {percentage > 0 ? <Percentage type="success">+{percentage}%</Percentage> : <Percentage type="error">{percentage}%</Percentage>}
      </FlexBox>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </div>;
}