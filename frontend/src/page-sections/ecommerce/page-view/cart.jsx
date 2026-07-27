import { memo } from 'react';
import { useNavigate } from 'react-router';
// MUI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { Counter } from '@/components/counter';
import { FlexBox } from '@/components/flexbox';
import { Scrollbar } from '@/components/scrollbar';
// CUSTOM PAGE SECTION COMPONENTS
import Stepper from '../Stepper';
import OrderSummery from '../order-summery';
// CUSTOM ICON COMPONENTS
import Clear from '@/icons/Clear';
import ChevronLeft from '@/icons/ChevronLeft';
// CUSTOM UTILS METHOD
import { currency } from '@/utils/currency';
// DUMMY CUSTOM DATA
import { cartList } from '@/data/cart';

// STYLED COMPONENTS
const HeadTableCell = styled(TableCell)({
  fontWeight: 500,
  padding: '10px 16px',
  '&:first-of-type': {
    paddingLeft: 24
  },
  '&:last-of-type': {
    paddingRight: 24
  }
});
const BodyTableCell = styled(HeadTableCell)({
  padding: '24px 16px',
  ':nth-of-type(1)': {
    minWidth: 250
  },
  ':nth-of-type(2)': {
    minWidth: 120
  }
});
const TableHeader = styled(TableHead)(({
  theme
}) => ({
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  })
}));
const CartTitle = styled(Typography)(({
  theme
}) => ({
  padding: '1.5rem',
  span: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.text.secondary
  }
}));
export default function CartPageView() {
  const navigate = useNavigate();
  return <div className="pt-2 pb-4">
      <Grid container spacing={3}>
        {/* STEPPER SECTION */}
        <Grid size={12}>
          <Box mt={3} maxWidth={700}>
            <Stepper stepNo={0} />
          </Box>
        </Grid>

        {/* CART LIST TABLE */}
        <Grid size={{
        md: 8,
        xs: 12
      }}>
          <Card>
            <CartTitle variant="h6">
              Cart <span>({cartList.length} item)</span>
            </CartTitle>

            <Scrollbar autoHide={false}>
              <Table sx={{
              minWidth: 600
            }}>
                <TableHeader>
                  <TableRow>
                    <HeadTableCell>Product</HeadTableCell>
                    <HeadTableCell>Quantity</HeadTableCell>
                    <HeadTableCell>Price</HeadTableCell>
                    <HeadTableCell>Action</HeadTableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {cartList.map(cart => <CartTableRow item={cart} key={cart.id} />)}
                </TableBody>
              </Table>
            </Scrollbar>
          </Card>

          <Box mt={2}>
            <Button disableRipple variant="text" startIcon={<ChevronLeft />} onClick={() => navigate('/dashboards/shop')}>
              Continue Shopping
            </Button>
          </Box>
        </Grid>

        {/* ORDER SUMMERY SECTION */}
        <Grid size={{
        md: 4,
        xs: 12
      }}>
          <OrderSummery showCoupon buttonText="Check Out Now" handleClick={() => navigate('/dashboard/billing-address')} />
        </Grid>
      </Grid>
    </div>;
}

// ==============================================================

// ==============================================================

const CartTableRow = memo(function ({
  item
}) {
  return <TableRow>
      <BodyTableCell>
        <FlexBox gap={1.5} alignItems="center">
          <Avatar variant="rounded" alt={item.name} src={item.image} sx={{
          width: 60,
          height: 60
        }} />

          <div>
            <Typography variant="body2" color="text.primary" fontWeight={500} lineHeight={1.7}>
              {item.name}
            </Typography>

            <Typography variant="body2" fontSize={13} sx={{
            span: {
              color: 'text.primary'
            }
          }}>
              Color: <span>{item.color}</span>
            </Typography>

            <Typography variant="body2" fontSize={13} sx={{
            span: {
              color: 'text.primary'
            }
          }}>
              Size: <span>{item.size}</span>
            </Typography>
          </div>
        </FlexBox>
      </BodyTableCell>

      <BodyTableCell>
        <Counter count={item.quantity} />
        <Typography variant="caption" sx={{
        display: 'block',
        mt: 0.5
      }}>
          Available: {item.stock}
        </Typography>
      </BodyTableCell>

      <BodyTableCell>
        <Typography variant="body2" color="text.primary">
          {currency(item.price)}
        </Typography>
      </BodyTableCell>

      <BodyTableCell>
        <IconButton>
          <Clear sx={{
          color: 'text.secondary'
        }} />
        </IconButton>
      </BodyTableCell>
    </TableRow>;
});