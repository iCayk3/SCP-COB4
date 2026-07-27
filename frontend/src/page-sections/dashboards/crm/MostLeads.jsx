import Chart from 'react-apexcharts';
// MUI
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
// MUI ICON COMPONENTS
import MailOutline from '@mui/icons-material/MailOutline';
import PersonOutline from '@mui/icons-material/PersonOutline';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import LocalPhoneOutlined from '@mui/icons-material/LocalPhoneOutlined';
// CUSTOM COMPONENTS
import { FlexBox } from '@/components/flexbox';
// CUSTOM HOOK
import { useChartOptions } from '@/hooks/useChartOptions';

// STYLED COMPONENT
const StyledChart = styled(Chart)({
  marginBottom: 24
});
const ListItem = styled('div')(({
  theme
}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '1rem 1.5rem',
  justifyContent: 'space-between',
  borderTop: `1px dashed ${theme.palette.divider}`
}));

// CUSTOM DUMMY DATA SET
const MOST_LEADS = [{
  id: 'puyMNe5ssqawzGwEQP1mx',
  title: 'Email',
  percentage: 60,
  Icon: MailOutline,
  color: 'primary.main',
  subtitle: '500 vs 1000'
}, {
  id: 'S7ZvVWtAlBJWOvUpKTnGR',
  title: 'Call',
  percentage: 10,
  Icon: LocalPhoneOutlined,
  color: 'success.500',
  subtitle: '360 vs 965'
}, {
  id: 'nFiI1J3yaddi9x5Xe1OmO',
  percentage: 20,
  title: 'Social',
  Icon: PersonOutline,
  color: 'grey.500',
  subtitle: '3684 vs 5000'
}, {
  id: 'V7BfG5RYp7q42sCkX-O5Z',
  percentage: 10,
  title: 'Other',
  Icon: LayersOutlined,
  color: 'grey.300',
  subtitle: '469 vs 678'
}];
export default function MostLeads() {
  const theme = useTheme();

  // REACT CHART OPTIONS
  const options = useChartOptions({
    stroke: {
      show: false
    },
    labels: ['Chrome', 'Opera Mini', 'Firefox', 'Yahoo!'],
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
    },
    colors: [theme.palette.primary.main, theme.palette.success[500], theme.palette.grey[500], theme.palette.grey[300]]
  });
  return <Card className="h-full">
      <Typography variant="h6" sx={{
      p: 3,
      textAlign: 'center'
    }}>
        Most Leads
      </Typography>

      <StyledChart height={130} type="donut" options={options} series={[40, 20, 20, 20]} />

      {MOST_LEADS.map(({
      Icon,
      title,
      subtitle,
      percentage,
      id,
      color
    }) => <ListItem key={id}>
          <FlexBox alignItems="center" gap={1}>
            <Icon sx={{
          color
        }} />

            <Typography variant="body2" fontWeight={500}>
              {title}
            </Typography>
          </FlexBox>

          <Typography variant="body2" noWrap color="text.secondary" fontWeight={500}>
            {subtitle}
          </Typography>

          <Typography variant="body2" fontWeight={500}>
            {percentage}%
          </Typography>
        </ListItem>)}
    </Card>;
}