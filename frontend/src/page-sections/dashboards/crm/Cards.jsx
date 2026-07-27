import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { styled, useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Title } from '@/components/title';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// STYLED COMPONENTS
const Wrapper = styled(Card)(({
  theme
}) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr'
  }
}));
const BoxItem = styled('div')(({
  theme
}) => ({
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    borderLeft: `1px dashed ${theme.palette.divider}`
  }
}));

// CUSTOM DUMMY DATA LIST
const DATA = [{
  id: 'i3JE6ZLWhyzho6ukUECKh',
  title: 'Cloths',
  amount: 2658
}, {
  id: '62qaGXQSGv7lUlvNdrBCd',
  title: 'Foods',
  amount: 6687
}, {
  id: 'MT7HfjfAHsUU6E2i36Jw7',
  title: 'Others',
  amount: 4348
}];

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Tasks',
  data: [22, 30, 46, 50, 46, 30, 22]
}];
export default function Cards() {
  const theme = useTheme();

  // CAMPAIGN SENT REACT CHART OPTIONS
  const campaignChartOptions = useChartOptions({
    stroke: {
      show: false
    },
    xaxis: {
      categories
    },
    colors: [theme.palette.divider, theme.palette.primary.main],
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '35%',
        borderRadiusApplication: 'end'
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

  // AVERAGE DEALS REACT CHART OPTIONS
  const dealsChartOptions = useChartOptions({
    labels: ['Cloths', 'Foods', 'Others'],
    colors: [theme.palette.primary.main, theme.palette.grey[600], theme.palette.grey[300]],
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
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
  return <Wrapper>
      {/* CAMPAIGN SENT BOX */}
      <Box p={3} mb={-3}>
        <Title title={1352} subtitle="Campaign Sent" percentage="+4.67%" />

        <Box mt={-2}>
          <Chart type="bar" series={series} options={campaignChartOptions} height={150} />
        </Box>
      </Box>

      {/* AVERAGE DEALS BOX */}
      <BoxItem>
        <div>
          <Title title={51352} subtitle="Average Deals" percentage="+12.5%" titlePrefix="$" />
        </div>

        <FlexBetween mt={2} gap={2} flexWrap="wrap">
          <Chart width={120} height={100} type="donut" options={dealsChartOptions} series={DATA.reduce((prev, curr) => [...prev, curr.amount], [])} />

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
      </BoxItem>

      {/* ANNUAL PROFIT */}
      <BoxItem>
        <div>
          <Title title={51352} titlePrefix="$" percentage="-2.65%" percentageType="error" subtitle="Annual Profit" />
        </div>

        <Box mt={4}>
          <FlexBetween mb={1}>
            <Typography variant="body2" fontWeight={600}>
              {currency(100500)} to Goal
            </Typography>

            <Typography variant="body2" color="text.secondary">
              75%
            </Typography>
          </FlexBetween>

          <LinearProgress value={60} color="success" variant="determinate" sx={{
          height: 8
        }} />
        </Box>
      </BoxItem>
    </Wrapper>;
}