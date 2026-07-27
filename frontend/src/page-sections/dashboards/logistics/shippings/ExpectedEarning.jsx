import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';
// CUSTOM COMPONENTS
import { Title } from '@/components/title';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';

// STYLED COMPONENTS
const RootStyled = styled('div')(({
  theme
}) => ({
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    borderRight: `1px dashed ${theme.palette.divider}`
  }
}));

// EARNING YEAR DUMMY DATA SET
const DATA = [{
  id: 1,
  title: 'Truck',
  amount: 2658
}, {
  id: 2,
  title: 'Ship',
  amount: 6687
}, {
  id: 3,
  title: 'Flight',
  amount: 4348
}];
export default function ExpectedEarning() {
  const theme = useTheme();

  // REACT CHART CATEGORIES LABEL
  const series = DATA.reduce((prev, curr) => [...prev, curr.amount], []);

  // REACT CHART OPTIONS
  const options = useChartOptions({
    labels: ['Truck', 'Ship', 'Flight'],
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    colors: [theme.palette.primary.main, theme.palette.grey[600], theme.palette.grey[300]],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '70%'
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '14px'
      },
      y: {
        formatter: val => `${val}`,
        title: {
          formatter: name => name
        }
      }
    }
  });
  return <RootStyled>
      <div>
        <Title title={51352} titlePrefix="$" percentage="+12.5%" subtitle="Expected Earning of this year" />
      </div>

      <FlexBetween mt={6} gap={2}>
        <Box ml={-2}>
          <Chart width={130} height={130} type="donut" options={options} series={series} />
        </Box>

        <Stack spacing={1} minWidth={120}>
          {DATA.map(item => <FlexBetween key={item.id}>
              <Typography variant="body2" fontWeight={500} color="text.secondary">
                {item.title}
              </Typography>

              <Typography variant="body2" fontWeight={500}>
                {currency(item.amount)}
              </Typography>
            </FlexBetween>)}
        </Stack>
      </FlexBetween>
    </RootStyled>;
}