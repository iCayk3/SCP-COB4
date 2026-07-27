import Chart from 'react-apexcharts';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Percentage } from '@/components/percentage';
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM UTILS METHODS
import { formatK } from '@/utils/currency';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// REACT CHART CATEGORIES LABEL
const categories = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// REACT CHART DATA SERIES
const series = [{
  name: 'Tasks',
  data: [22, 30, 46, 50, 46, 30, 22]
}];
export default function YoutubeCampaign() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    stroke: {
      show: false
    },
    xaxis: {
      categories
    },
    colors: [theme.palette.divider, theme.palette.primary.main],
    plotOptions: {
      bar: {
        borderRadius: 8,
        distributed: true,
        columnWidth: '40%',
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
  return <Card>
      <div className="p-3">
        <Typography variant="h6">YouTube Campaign</Typography>

        <Typography variant="body2" fontSize={13} color="text.secondary">
          Active Campaign
        </Typography>
      </div>

      <FlexBetween flexWrap="wrap" px={3} zIndex={1} position="relative">
        <div>
          <FlexBox alignItems="center" gap={1}>
            <Typography variant="body2" fontSize={22} fontWeight={600}>
              {formatK(500000)}
            </Typography>

            <Percentage type="error">-10.25%</Percentage>
          </FlexBox>

          <Typography variant="body2" color="text.secondary">
            Subscribers
          </Typography>
        </div>

        <div>
          <FlexBox alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight={600} fontSize={22}>
              {formatK(1000000)}
            </Typography>

            <Percentage type="success">+4.67%</Percentage>
          </FlexBox>

          <Typography variant="body2" color="text.secondary">
            Subscribers Goal
          </Typography>
        </div>
      </FlexBetween>

      <Box mt={-1}>
        <Chart type="bar" series={series} options={options} height={250} />
      </Box>
    </Card>;
}