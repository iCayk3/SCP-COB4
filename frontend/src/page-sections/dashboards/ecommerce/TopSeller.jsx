import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { FlexBetween, FlexBox } from '@/components/flexbox';
import { currency, format } from '@/utils/currency';

// CUSTOM DUMMY DATA
const TOP_SELLERS = [{
  id: 'hopUn76l4OiDBEmcAzzdL',
  totalSold: 13440,
  totalAmount: 350000,
  country: '/static/flags/usa-round.png',
  user: {
    name: 'Gage Paquette',
    image: '/static/user/user-11.png'
  }
}, {
  id: 'DK9qsmNAslr3Pr-pZQIEi',
  totalSold: 10240,
  totalAmount: 148000,
  country: '/static/flags/uk-round.png',
  user: {
    name: 'Lara Harvey',
    image: '/static/user/user-16.png'
  }
}, {
  id: 'NIc3lbgO9iX8j_TRPCQud',
  totalSold: 10240,
  totalAmount: 148000,
  country: '/static/flags/germany-round.png',
  user: {
    name: 'Evan Scott',
    image: '/static/user/user-17.png'
  }
}, {
  id: 'ixaKJO-PjtIfgCKrIaoGJ',
  totalSold: 10240,
  totalAmount: 148000,
  country: '/static/flags/spain-round.png',
  user: {
    name: 'Benja Johnston',
    image: '/static/user/user-18.png'
  }
}];
export default function TopSeller() {
  return <Card className="p-3 h-full">
      <Typography variant="h6">Top Seller</Typography>

      <FlexBetween mt={3} mb={2}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Profile
        </Typography>

        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Items sold
        </Typography>
      </FlexBetween>

      <Stack spacing={3}>
        {TOP_SELLERS.map(item => <FlexBetween key={item.id}>
            <FlexBox gap={1.5} alignItems="center">
              <Badge overlap="circular" anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }} badgeContent={<Avatar alt="Remy Sharp" src={item.country} sx={{
            all: 'unset',
            width: 17,
            height: 17
          }} />}>
                <Avatar alt={item.user.name} src={item.user.image} sx={{
              width: 45,
              height: 45
            }} />
              </Badge>

              <div>
                <Typography variant="body2" lineHeight={1} fontWeight={600}>
                  {item.user.name}
                </Typography>

                <Typography variant="caption" fontWeight={500} color="text.secondary">
                  {currency(item.totalAmount)}
                </Typography>
              </div>
            </FlexBox>

            <Typography variant="body2" fontWeight={500} color="text.secondary">
              {format(item.totalSold)}
            </Typography>
          </FlexBetween>)}
      </Stack>
    </Card>;
}