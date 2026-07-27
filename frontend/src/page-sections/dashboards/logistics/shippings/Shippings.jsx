import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import ShippingOrders from './ShippingOrders';
import ExpectedEarning from './ExpectedEarning';

// STYLED COMPONENTS
const Wrapper = styled(Card)(({
  theme
}) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr'
  }
}));
export default function Shippings() {
  return <Wrapper>
      {/* EXPECTED EARNING OF THE YEAR BOX */}
      <ExpectedEarning />

      {/* SHIPPING ORDER THIS MONTH */}
      <ShippingOrders />
    </Wrapper>;
}