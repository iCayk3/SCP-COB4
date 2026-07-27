import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';

// CUSTOM DUMMY DATA
const DATA = [{
  id: 'AAtkng56zk6qF7jAPH5Vu',
  dealWon: 25000,
  balance: 25360,
  owner: {
    name: 'Astole Banne',
    image: '/static/user/user-11.png'
  }
}, {
  id: 'SsJ2NwzDfXpf_z7FjGq3y',
  dealWon: 25000,
  balance: 25360,
  owner: {
    name: 'Jhone Abela',
    image: '/static/user/user-16.png'
  }
}, {
  id: 'UbGlAkJAObR-ohftidjh3',
  dealWon: 25000,
  balance: 25360,
  owner: {
    name: 'Lisa Been',
    image: '/static/user/user-17.png'
  }
}];
export default function DealForecast() {
  return <Card className="p-3 h-full">
      <Typography variant="h6">Deal Forecast by Owner</Typography>

      <FlexBetween mt={3} mb={2}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Owner
        </Typography>

        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Deal Won
        </Typography>
      </FlexBetween>

      <Stack spacing={2.5}>
        {DATA.map(({
        balance,
        dealWon,
        id,
        owner
      }) => <FlexBetween key={id}>
            <FlexBox gap={1}>
              <Avatar alt={owner.name} src={owner.image} sx={{
            width: 35,
            height: 35
          }} />

              <div>
                <Typography variant="body2" lineHeight={1} fontWeight={600}>
                  {owner.name}
                </Typography>

                <Typography variant="caption" fontWeight={500} color="text.secondary">
                  {currency(balance)}
                </Typography>
              </div>
            </FlexBox>

            <Typography variant="body2" fontWeight={500} color="text.secondary">
              {currency(dealWon)}
            </Typography>
          </FlexBetween>)}
      </Stack>
    </Card>;
}