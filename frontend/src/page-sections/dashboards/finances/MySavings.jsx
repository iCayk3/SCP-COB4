import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
// CUSTOM COMPONENTS
import ListItem from './shared/ListItem';
import { FlexBetween } from '@/components/flexbox';
// CUSTOM ICON COMPONENTS
import Health from '@/icons/Health';
import Emergency from '@/icons/Emergency';
import Investment from '@/icons/Investment';
import EducationTwo from '@/icons/EducationTwo';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';

// CUSTOM DUMMY DATA
const SAVINGS = [{
  id: '2z3etVoOEbTXDtU7W1Vqb',
  amount: 23560,
  Icon: Emergency,
  title: 'Emergency',
  color: 'primary.main'
}, {
  id: 'eHEAV4sbfs9sNeO_RU9Rj',
  amount: 19489,
  Icon: Health,
  title: 'Health',
  color: 'success.500'
}, {
  id: 'K6Fu6rvGSevdkdJ2KCML3',
  amount: 18889,
  Icon: Investment,
  title: 'Investment',
  color: 'error.main'
}, {
  id: '8JBVHvFX2_xKts-45VI5A',
  amount: 21489,
  Icon: EducationTwo,
  title: 'Education',
  color: 'warning.main'
}];
export default function MySavings() {
  return <Card className="p-3">
      <Typography variant="h6">My Savings</Typography>

      <Stack mt={3} spacing={2}>
        {SAVINGS.map(({
        id,
        amount,
        Icon,
        title,
        color
      }) => <FlexBetween key={id}>
            <ListItem subTitle={title} title={currency(amount)} Icon={<Icon sx={{
          color,
          fontSize: 19
        }} />} titleStyle={{
          fontSize: 16,
          lineHeight: 1.5
        }} iconStyle={{
          width: 48,
          height: 48,
          borderRadius: 3
        }} />

            <IconButton>
              <KeyboardArrowRightRounded sx={{
            color: 'grey.400'
          }} />
            </IconButton>
          </FlexBetween>)}
      </Stack>
    </Card>;
}