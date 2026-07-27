import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
// MUI
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '@/components/flexbox';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
// CUSTOM DATA
const ORDER_LIST = [{
  name: 'Nike Air max 170',
  image: '/static/products/shoe-1.png',
  price: 654
}, {
  name: 'Cactus Plant',
  image: '/static/products/bonsai.png',
  price: 654
}, {
  name: 'Minimal Pot',
  image: '/static/products/airbud.png',
  price: 654
}, {
  name: 'Adidas Blaze',
  image: '/static/products/shoe-2.png',
  price: 654
}];
export default function RecentOrders() {
  const {
    t
  } = useTranslation();
  return <Card className="p-3">
      <FlexBetween pb={3}>
        <Typography variant="h6" fontSize={16}>
          {t('Recent Orders')}
        </Typography>

        <NavLink to="#">
          <Typography variant="body2" color="primary.main">
            View all
          </Typography>
        </NavLink>
      </FlexBetween>

      <Stack spacing={3}>
        {ORDER_LIST.map((item, index) => <FlexBetween key={index} gap={1}>
            <FlexBox alignItems="center" gap={1.5}>
              <Avatar src={item.image} alt={item.name} sx={{
            borderRadius: '15%'
          }} />

              <div>
                <Typography variant="body2" lineHeight={1} fontWeight={600}>
                  {item.name}
                </Typography>

                <Typography variant="caption" pt={0.6} fontSize={12} color="text.secondary">
                  10 min ago
                </Typography>
              </div>
            </FlexBox>

            <Typography variant="body2" fontWeight={500}>
              {currency(item.price)}
            </Typography>
          </FlexBetween>)}
      </Stack>
    </Card>;
}