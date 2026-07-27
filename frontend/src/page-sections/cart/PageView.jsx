import { Fragment, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
// MUI
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import CartItem from './CartItem';
import { Scrollbar } from '@/components/scrollbar';
import { SectionTitle } from '@/components/section-title';
import HeaderEffect from '@/layouts/root/HeaderEffect';
// CUSTOM PAGE SECTION COMPONENTS
import OrderSummery from '@/page-sections/ecommerce/order-summery';
// STYLED COMPONENTS
import { StyledTableHead, HeadTableCell, Heading, StyledContainer } from './styles';
// CUSTOM DATA
import { CART_ITEMS } from '@/data/cart';
export default function CartPageView() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(CART_ITEMS);
  const handleRemoveItem = useCallback(id => {
    setCartItems(state => state.filter(item => item.id !== id));
  }, []);
  const handleUpdateQuantity = useCallback((id, quantity) => {
    setCartItems(state => state.map(item => item.id === id ? {
      ...item,
      quantity
    } : item));
  }, []);
  return <Fragment>
      {/* PAGE HEADING SECTION */}
      <HeaderEffect>
        <Heading>
          <SectionTitle centered title="Cart" />
          <Typography variant="body1" fontSize={18}>
            Complete Your Transaction in Just a Few Clicks.
          </Typography>
        </Heading>
      </HeaderEffect>

      <StyledContainer maxWidth="lg">
        <Grid container spacing={3}>
          {/* CART LIST TABLE */}
          <Grid size={{
          md: 8,
          xs: 12
        }}>
            <Card>
              <Typography variant="h6" fontSize={18} sx={{
              padding: '1rem 1.5rem',
              span: {
                fontSize: 14,
                fontWeight: 400,
                color: 'text.secondary'
              }
            }}>
                Cart <span>({cartItems.length} item)</span>
              </Typography>

              <Scrollbar autoHide={false}>
                <Table sx={{
                minWidth: 600
              }}>
                  <StyledTableHead>
                    <TableRow>
                      <HeadTableCell>Product</HeadTableCell>
                      <HeadTableCell>Quantity</HeadTableCell>
                      <HeadTableCell>Price</HeadTableCell>
                      <HeadTableCell>Action</HeadTableCell>
                    </TableRow>
                  </StyledTableHead>

                  <TableBody>
                    {cartItems.map(item => <CartItem key={item.id} item={item} onRemoveItem={handleRemoveItem} onUpdateQuantity={handleUpdateQuantity} />)}
                  </TableBody>
                </Table>
              </Scrollbar>
            </Card>
          </Grid>

          {/* ORDER SUMMERY SECTION */}
          <Grid size={{
          md: 4,
          xs: 12
        }}>
            <OrderSummery showCoupon buttonText="Check Out Now" handleClick={() => navigate('/checkout')} />
          </Grid>
        </Grid>
      </StyledContainer>
    </Fragment>;
}