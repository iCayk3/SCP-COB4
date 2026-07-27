import { Fragment, useCallback, useState } from 'react';
// MUI
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import Summery from '../summery';
import CheckoutForm from '../checkout-form';
import { SectionTitle } from '@/components/section-title';
import HeaderEffect from '@/layouts/root/HeaderEffect';
// STYLED COMPONENTS
import { Heading, StyledContainer } from './styles';
export default function CheckoutPageView() {
  const [selectedPayment, setSelectedPayment] = useState('card');
  const activeMethod = useCallback(method => selectedPayment === method, [selectedPayment]);
  const handleSelectedPayment = useCallback(method => setSelectedPayment(method), [setSelectedPayment]);
  return <Fragment>
      {/* PAGE HEADING SECTION */}
      <HeaderEffect>
        <Heading>
          <SectionTitle centered title="Checkout" />
          <Typography variant="body1" fontSize={18}>
            Complete Your Transaction in Just a Few Clicks.
          </Typography>
        </Heading>
      </HeaderEffect>

      <StyledContainer maxWidth="lg">
        <Grid container spacing={3}>
          {/* CHECKOUT FORM SECTION */}
          <Grid size={{
          lg: 8,
          md: 7,
          xs: 12
        }}>
            <CheckoutForm activeMethod={activeMethod} handleSelectedPayment={handleSelectedPayment} />
          </Grid>

          {/* CHECKOUT SUMMERY SECTION */}
          <Grid size={{
          lg: 4,
          md: 5,
          xs: 12
        }}>
            <Summery />
          </Grid>
        </Grid>
      </StyledContainer>
    </Fragment>;
}